const navLinks = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "about",
    path: "/about",
  },
  {
    name: "Submit",
    path: "/submit",
  },
  {
    name: "Gallery",
    path: "/boards",
  },
  {
    name: "Admin",
    path: "/admin",
  },
];

const adminLinks = [
  {
    name: "Create New Board",
    path: "/admin/create",
  },
  {
    name: "Delete Board",
    path: "/admin/delete",
  },
];

const homeLinks = [
  {
    name: "Submit",
    path: "/submit",
  },
  {
    name: "Gallery",
    path: "/boards",
  },
  {
    name: "about",
    path: "/about",
  },
];

module.exports = {
  navLinks,
  adminLinks,
  homeLinks,
};
