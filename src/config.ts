import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://mumaniu.cn",
  author: "牧码牛",
  desc: "牧码牛的博客",
  title: "牧码牛的博客",
  lightAndDarkMode: true,
  postPerPage: 10,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
};

export const LOCALE = {
  lang: "en", // html lang code. Set this empty and default will be "en"
  langTag: ["zh-CN"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/mwxxhdb/mwxxhdb.github.io",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:houdianbo@foxmail.com",
    linkTitle: `Send an email to ${SITE.title}`,
    active: false,
  },
  {
    name: "Bilibili",
    href: "https://space.bilibili.com/146576758",
    linkTitle: `哔哩哔哩`,
    active: true,
  },
];
