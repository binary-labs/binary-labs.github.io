var navbar = document.getElementById("top-bar");
var menu = document.getElementById("menu");
var hamburger = document.getElementById("hamburger");
var circle = document.getElementById("circle");
var start_of_text = document.getElementById("summary");
var show_all_button = document.getElementById("show_all");
var projects = document.getElementsByClassName("project");

window.onload = function()
{
  menu_targets = getMenuTargets();

  active_target = null;

  setMenuStyle();
  updateActiveNav();

  window.onscroll = function()
  {
    setMenuStyle();
    updateActiveNav();
  };

  hamburger.onclick = function()
  {
    toggleMobileMenu();
  }

  for (i=0; i<menu.children.length; i++)
  {
    menu.children[i].children[0].onclick = toggleMobileMenu;
  }

  for (i=0; i<projects.length; i++)
  {
    projectPicture = projects[i].getElementsByTagName('img')[0]
    console.log(projectPicture)
    projectPicture.onclick = toggleProjectFull;
  }

  show_all_button.onclick = showAllProjects;
}


function toggleMobileMenu()
{
  menu.classList.toggle("mobile");
}

function setMenuStyle()
{
  pos = window.pageYOffset;

  const border_circle = 30;
  const hysteresis_circle = 20;

  if (!circle.classList.contains("hidden") && pos > border_circle + hysteresis_circle)
  {
    circle.classList.add("hidden");
  }

  if (circle.classList.contains("hidden") && pos < border_circle - hysteresis_circle)
  {
    circle.classList.remove("hidden");
  }

  const border_nav = 30;
  const hysteresis_nav = 20;

  if (!navbar.classList.contains("hidden") && pos < border_nav - hysteresis_nav)
  {
    navbar.classList.add("hidden");
  }

  if (navbar.classList.contains("hidden") && pos > border_nav + hysteresis_nav)
  {
    navbar.classList.remove("hidden");
  }


  if (pos >= start_of_text.offsetTop)
  {
    navbar.classList.add("small");
  }
  else
  {
    navbar.classList.remove("small");
  }
}

function getMenuTargets()
{
  elements = []
  items = menu.children;
  for (i=0; i<items.length; i++)
  {
    item = items[i];
    url = item.children[0].href;
    id = url.split('#').pop();
    elements.push(document.getElementById(id));
  }
  return elements;
}


function updateActiveNav()
{
  // the position that defines which section is focused is in first third of the screen
  pos = window.pageYOffset + window.innerHeight/3;

  // start with no entry active
  newSection = null;

  // check if we are past the first section
  if (pos > menu_targets[0].offsetTop)
  {
    newSection = 0;

    // go further through all remaining sections
    for (i=1; i<menu_targets.length; i++)
    {
      // check if we reached this section
      if (pos > menu_targets[i].offsetTop)
      {
        newSection = newSection + 1;
      }
      else
      {
        // we did not reach this section. Current one is the best match
        break;
      }
    }

    // special case to reach last section:
    // active last section if it is completly visible
    if (newSection == menu_targets.length - 2)
    {
      activateLastBeforeEnd = 5;
      if(window.pageYOffset + window.innerHeight >= menu_targets[menu_targets.length-1].offsetTop + menu_targets[menu_targets.length-1].offsetHeight - activateLastBeforeEnd)
      {
        newSection = menu_targets.length - 1;
      }
    }
  }

  setActiveMenuEntry(newSection);
}

function setActiveMenuEntry(index)
{
  active_target = index;
  items = menu.children;
  for (i=0; i<items.length; i++)
  {
    if (i == index)
    {
      items[i].classList.add("active");
    }
    else
    {
      items[i].classList.remove("active");
    }
  }
}

function showAllProjects()
{
  show_all_button.classList.add("hidden");

  for (i=0; i<projects.length; i++)
  {
    projects[i].classList.remove("optional");
  }
}

function toggleProjectFull()
{
  project = this.parentElement;

  if (project.classList.contains("full"))
  {
    project.classList.remove("full");
  }
  else
  {
    for (i=0; i<projects.length; i++)
    {
      projects[i].classList.remove("full");
    }
    project.classList.add("full");
  }
  window.scroll(0, getGlobalPosition(project).top - 120);
}

function getGlobalPosition(element) {
    var top = 0, left = 0;
    do {
        top += element.offsetTop  || 0;
        left += element.offsetLeft || 0;
        element = element.offsetParent;
    } while(element);

    return {
        top: top,
        left: left
    };
};
