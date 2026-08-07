window.BLOG_DATA = {
  site: (window.BLOG_SITE_DATA && window.BLOG_SITE_DATA.site) || {},
  navSearchPages: window.BLOG_NAV_PAGES || [],
  postList: window.BLOG_POST_LIST || [],
  chatterList: window.BLOG_CHATTER_LIST || [],
  photoAlbum: window.BLOG_PHOTO_ALBUM || { title: "", subtitle: "", photos: [] },
  twikoo: (window.BLOG_SITE_DATA && window.BLOG_SITE_DATA.twikoo) || { envId: "" },
  siteStartDate: (window.BLOG_SITE_DATA && window.BLOG_SITE_DATA.siteStartDate) || "2026-05-12T00:00:00"
};
