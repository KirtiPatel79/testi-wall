import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";

const UNKNOWN = "Unknown";
const NO_COORDS = "-";
const IPIFY_URL = "https://api64.ipify.org?format=json";
const IPAPI_BASE_URL = "https://ipapi.co";

type IpifyResponse = {
  ip?: string;
};

type IpApiResponse = {
  ip?: string;
  city?: string;
  region?: string;
  country_name?: string;
  org?: string;
  latitude?: number | string;
  longitude?: number | string;
  postal?: string;
  timezone?: string;
  error?: boolean;
};

export type GeoData = {
  ip: string;
  isp: string;
  city: string;
  region: string;
  country: string;
  coords: string;
  postal: string;
  timezone: string;
};

export type VisitorInfo = {
  page: string;
  source: string;
  time: string;
  device: string;
  browser: string;
  os: string;
  lang: string;
  ip: string;
  isp: string;
  city: string;
  region: string;
  country: string;
  coords: string;
  postal: string;
  timezone: string;
};

function getFirstIpValue(value: string | null): string | undefined {
  if (!value) return undefined;
  return value.split(",")[0]?.trim();
}

function normalizeIp(raw: string | undefined): string | undefined {
  if (!raw) return undefined;

  let value = raw.trim().replace(/^"+|"+$/g, "");
  if (!value) return undefined;

  if (value.toLowerCase().startsWith("for=")) {
    value = value.slice(4).split(";")[0]?.trim() || "";
  }

  if (value.startsWith("::ffff:")) {
    value = value.slice("::ffff:".length);
  }

  if (value.startsWith("[") && value.includes("]")) {
    value = value.slice(1, value.indexOf("]"));
  } else if (value.includes(":") && value.includes(".") && value.indexOf(":") === value.lastIndexOf(":")) {
    value = value.split(":")[0];
  }

  return value.trim() || undefined;
}

function isUnknownIp(ip: string | undefined): boolean {
  if (!ip) return true;
  const normalized = ip.toLowerCase();
  return normalized === "unknown" || normalized === "null" || normalized === "undefined";
}

async function getIpFromIpify(): Promise<string> {
  try {
    const response = await fetch(IPIFY_URL, {
      method: "GET",
      cache: "no-store",
    });
    if (!response.ok) return UNKNOWN;

    const data = (await response.json()) as IpifyResponse;
    return normalizeIp(data.ip) || UNKNOWN;
  } catch {
    return UNKNOWN;
  }
}

async function resolveClientIp(headersList: Headers): Promise<string> {
  const headerCandidates = [
    getFirstIpValue(headersList.get("x-forwarded-for")),
    getFirstIpValue(headersList.get("cf-connecting-ip")),
    getFirstIpValue(headersList.get("x-real-ip")),
    getFirstIpValue(headersList.get("x-client-ip")),
    getFirstIpValue(headersList.get("x-vercel-forwarded-for")),
    getFirstIpValue(headersList.get("x-forwarded")),
    getFirstIpValue(headersList.get("forwarded")),
  ];

  for (const candidate of headerCandidates) {
    const normalized = normalizeIp(candidate);
    if (normalized && !isUnknownIp(normalized)) {
      return normalized;
    }
  }

  return getIpFromIpify();
}

function getReferrer(headersList: Headers): string {
  const ref = headersList.get("referer") || headersList.get("referrer");
  if (!ref) return "Direct";

  try {
    const url = new URL(ref);
    return url.origin;
  } catch {
    return ref;
  }
}

function getDefaultGeo(ip: string): GeoData {
  return {
    ip,
    isp: UNKNOWN,
    city: UNKNOWN,
    region: UNKNOWN,
    country: UNKNOWN,
    coords: NO_COORDS,
    postal: UNKNOWN,
    timezone: UNKNOWN,
  };
}

async function getGeoData(ip: string): Promise<GeoData> {
  const defaults = getDefaultGeo(ip);
  if (isUnknownIp(ip)) return defaults;

  try {
    const response = await fetch(`${IPAPI_BASE_URL}/${encodeURIComponent(ip)}/json/`, {
      method: "GET",
      cache: "no-store",
    });
    if (!response.ok) return defaults;

    const data = (await response.json()) as IpApiResponse;
    if (data.error) return defaults;

    const lat = data.latitude != null ? String(data.latitude) : "";
    const lon = data.longitude != null ? String(data.longitude) : "";
    const coords = lat && lon ? `${lat}, ${lon}` : NO_COORDS;

    return {
      ip: normalizeIp(data.ip) || ip,
      isp: data.org || UNKNOWN,
      city: data.city || UNKNOWN,
      region: data.region || UNKNOWN,
      country: data.country_name || UNKNOWN,
      coords,
      postal: data.postal || UNKNOWN,
      timezone: data.timezone || UNKNOWN,
    };
  } catch {
    return defaults;
  }
}

function getDeviceAndBrowser(userAgent: string): { device: string; browser: string; os: string } {
  const parser = new UAParser(userAgent);
  const ua = parser.getResult();
  const deviceType = ua.device.type || "desktop";
  const device =
    deviceType === "mobile"
      ? "Mobile"
      : deviceType === "tablet"
        ? "Tablet"
        : "Desktop";
  const browser = ua.browser.name && ua.browser.version ? `${ua.browser.name} ${ua.browser.version}` : UNKNOWN;
  const os = ua.os.name && ua.os.version ? `${ua.os.name} ${ua.os.version}` : UNKNOWN;

  return { device, browser, os };
}

export async function getVisitorInfo(page: string): Promise<VisitorInfo> {
  const headersList = await headers();
  const ip = await resolveClientIp(headersList);
  const userAgent = headersList.get("user-agent") || "";
  const lang = headersList.get("accept-language")?.split(",")[0]?.trim() || "";
  const geo = await getGeoData(ip);
  const ua = getDeviceAndBrowser(userAgent);

  return {
    page,
    source: getReferrer(headersList),
    time: new Date().toLocaleString(),
    device: ua.device,
    browser: ua.browser,
    os: ua.os,
    lang,
    ip: geo.ip,
    isp: geo.isp,
    city: geo.city,
    region: geo.region,
    country: geo.country,
    coords: geo.coords,
    postal: geo.postal,
    timezone: geo.timezone,
  };
}

export async function getVisitorInfoForLogin(): Promise<{
  ip: string;
  isp: string;
  city: string;
  region: string;
  country: string;
  device: string;
  browser: string;
}> {
  const headersList = await headers();
  const ip = await resolveClientIp(headersList);
  const userAgent = headersList.get("user-agent") || "";
  const geo = await getGeoData(ip);
  const ua = getDeviceAndBrowser(userAgent);

  return {
    ip: geo.ip,
    isp: geo.isp,
    city: geo.city,
    region: geo.region,
    country: geo.country,
    device: ua.device,
    browser: ua.browser,
  };
}
