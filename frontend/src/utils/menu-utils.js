const MenuUtils = {
    setActiveMenuItem: function(route) {
        // Находим все ссылки в меню
        const menuLinks = document.querySelectorAll('.nav.nav-pills.flex-column.mb-auto a');

        // Удаляем класс "active" у всех ссылок
        menuLinks.forEach(link => link.classList.remove('active'));

        // Используем значение свойства `route` для поиска элемента <a>
      //  const activeLink = document.querySelector(`a[href="${route}"]`);
        const activeLink = Array.from(menuLinks).find(link => link.getAttribute('href') === route);
        //console.log('active.link=', activeLink)
        // Проверяем, найден ли элемент
        if (activeLink) {
            activeLink.classList.add("active");
            activeLink.classList.remove("link-dark");
        } else {
            console.warn(`Ссылка с href="${route}" не обнаружена.`);
        }
    },
};

export default MenuUtils;