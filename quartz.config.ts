import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4.0 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Tech with MJ",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "mitrajit.github.io",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "created",
    generateSocialImages: false,
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Schibsted Grotesk",
        body: "Exo 2",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#fafafa", // From --background-primary
          lightgray: "#eaeaeb", // From --background-primary-alt
          gray: "#8e8e90", // From --text-muted
          darkgray: "#383a42", // From --text-normal
          dark: "#383a42", // From --gray-1
          secondary: "#1592ff", // From --text-accent
          tertiary: "#a625a4", // From --purple
          highlight: "rgba(0, 122, 255, 0.15)", // From --text-selection
          textHighlight: "rgba(255, 255, 0, 0.4)", // From --text-highlight-bg
        },
        darkMode: {
          light: "#272b34", // From --background-primary
          lightgray: "#20242b", // From --background-primary-alt
          gray: "#888G", // From --text-muted
          darkgray: "#dcddde", // From --text-normal
          dark: "#dcddde", // Matching text-normal for consistency
          secondary: "#61afef", // From --text-accent
          tertiary: "#c678dd", // From --purple
          highlight: "rgba(0, 122, 255, 0.2)", // From --text-selection
          textHighlight: "rgba(255, 255, 0, 0.4)", // From --text-highlight-bg
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
