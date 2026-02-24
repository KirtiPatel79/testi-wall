const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

type VisitData = {
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

type LoginData = {
  email: string;
  ip: string;
  isp: string;
  city: string;
  region: string;
  country: string;
  time: string;
  device: string;
  browser: string;
};

function buildLocation(data: { city: string; region: string; country: string }): string {
  return [data.city, data.region, data.country].filter((value) => value && value !== "Unknown").join(", ") || "Unknown";
}

function buildVisitEmbed(data: VisitData) {
  return {
    username: "TestiWall Tracker",
    embeds: [
      {
        author: {
          name: "Visitor Activity",
        },
        title: "New Page Visit",
        color: 0x059669,
        fields: [
          { name: "Page", value: `\`${data.page}\``, inline: false },
          { name: "Source", value: data.source || "Direct", inline: false },
          { name: "IP", value: `\`${data.ip}\``, inline: true },
          { name: "ISP", value: data.isp, inline: true },
          { name: "Location", value: buildLocation(data), inline: false },
          { name: "Coordinates", value: data.coords, inline: true },
          { name: "Timezone", value: data.timezone, inline: true },
          { name: "Postal", value: data.postal, inline: true },
          { name: "Device", value: data.device, inline: true },
          { name: "Browser", value: data.browser, inline: true },
          { name: "OS", value: data.os, inline: true },
          { name: "Language", value: data.lang || "Unknown", inline: true },
        ],
        footer: {
          text: `Captured at ${data.time}`,
        },
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

function buildLoginEmbed(data: LoginData) {
  return {
    username: "TestiWall Tracker",
    embeds: [
      {
        author: {
          name: "Auth Activity",
        },
        title: `Successful Login: ${data.email}`,
        color: 0x0d9488,
        fields: [
          { name: "IP", value: `\`${data.ip}\``, inline: true },
          { name: "ISP", value: data.isp, inline: true },
          { name: "Location", value: buildLocation(data), inline: false },
          { name: "Device", value: data.device, inline: true },
          { name: "Browser", value: data.browser, inline: true },
        ],
        footer: {
          text: `Captured at ${data.time}`,
        },
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

export async function sendVisitToDiscord(data: VisitData): Promise<boolean> {
  if (!WEBHOOK_URL) return false;

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildVisitEmbed(data)),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function sendLoginToDiscord(data: LoginData): Promise<boolean> {
  if (!WEBHOOK_URL) return false;

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildLoginEmbed(data)),
    });
    return res.ok;
  } catch {
    return false;
  }
}
