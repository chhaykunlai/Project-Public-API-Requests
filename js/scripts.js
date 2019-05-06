$(function () {
    let currentIndex = 0;
    const userParameters = ['picture', 'name', 'email', 'location', 'cell', 'dob'];
    const $userModal = $('.modal-container');
    const userRequestURL = 'https://randomuser.me/api/?nat=US&inc='
        + userParameters.join()
        + '&results=12';
    
    /**
     * Gets users from API
     * @param {string} url 
     */
    const getUsers = url => {
        return $.ajax({
            url: url,
            dataType: 'json'
        });
    };

    /**
     * Appends results for displaying users
     * @param {object} response 
     */
    const addUserList = response => {
        if (response && response.results) {
            response.results.forEach(function(user, index) {
                const $gallery = $('#gallery');
                const $cardContainer = $('<div class="card">');
                const $cardImage = $('<div class="card-img-container">');
                const $cardInfo = $('<div class="card-info-container">');
                const $image = $('<img class="card-img"/>');
                let cardInfoArray = [];

                $image.attr('src', user.picture.medium);
                $image.attr('alt', 'profile picture');
                $cardImage.append($image);

                cardInfoArray.push('<h3 id="' + user.name.first + user.name.last + '" class="card-name cap">');
                cardInfoArray.push(user.name.first + ' ');
                cardInfoArray.push(user.name.last);
                cardInfoArray.push('</h3>');
                cardInfoArray.push('<p class="card-text">' + user.email + '</p>');
                cardInfoArray.push('<p class="card-text cap">');
                cardInfoArray.push(user.location.city + ', ');
                cardInfoArray.push(user.location.state);
                cardInfoArray.push('</p>');
                $cardInfo.append(cardInfoArray.join(''));

                $cardContainer
                    .append($cardImage)
                    .append($cardInfo);
                $cardContainer.data('user', user);
                $cardContainer.data('index', index);
                $gallery.append($cardContainer);

            });
        }
    };

    /**
     * Displays user modal for specific employee
     * when user clicks
     * @param {event} e 
     */
    const displayUserModal = e => {
        let $cardContainer = $(e.target);

        if (!$(e.target).hasClass('card')) {
            $cardContainer = $(e.target).closest('.card');
        }
        currentIndex = $cardContainer.data('index');

        const userInfo = $cardContainer.data('user');
        const dob = new Date(userInfo.dob.date);
        const userDateOfBith = [dob.getDate(), dob.getMonth(), dob.getYear()];
        const userAddress = [userInfo.location.street, userInfo.location.state, 'OR ' + userInfo.location.postcode]

        $userModal.removeClass('hide');
        $userModal.find('.modal-img').attr('src', userInfo.picture.medium);
        $userModal.find('#name').text(userInfo.name.first + ' ' + userInfo.name.last);
        $userModal.find('.email').text(userInfo.email);
        $userModal.find('p.cap').text(userInfo.location.city);
        $userModal.find('.cellphone').text(userInfo.cell);
        $userModal.find('.address').text(userAddress.join(', '));
        $userModal.find('.dob').text('Birthday: ' + userDateOfBith.join('/'));
    };

    /**
     * Closes user modal
     */
    const closeModal = () => $userModal.addClass('hide');

    /**
     * Searchs user by name
     */
    const searchUser = (e) => {
        e.preventDefault();
        const search = $('.search-input').val();
        const $cardContainers = $('.card');
        if (search) {
            for (let i = 0; i < $cardContainers.length; i++) {
                const cardContainer = $cardContainers[i];
                const user = $(cardContainer).data('user');
                let fullname = user.name.first + ' ' + user.name.last;
                fullname = fullname.toLowerCase();
                if (!fullname.includes(search.toLowerCase())) {
                    $(cardContainer).addClass('hide');
                } else {
                    $(cardContainer).removeClass('hide');
                }
            }
        } else {
            $cardContainers.removeClass('hide');
        }
    };

    /**
     * Shows user on modal when user click
     * next or previous button on modal
     * @param {event} e 
     */
    const showUser = (e) => {
        const $button = $(e.target);
        const $cardContainers = $('.card').not('.hide');
        const currentMaxUser = $cardContainers.length;
        let increasement = 1;
        let userIndex = 0;
        for (let i = 0; i < currentMaxUser; i++) {
            const cardContainer = $cardContainers[i];
            const index = $(cardContainer).data('index');
            if (parseInt(index) === currentIndex) {
                userIndex = i;
            }
        }
        if ((userIndex > 0 && !$button.hasClass('modal-prev')) && (userIndex < currentMaxUser && !$button.hasClass('modal-next'))) {
            return;
        }
        if ($button.hasClass('modal-prev')) {
            increasement = -1;
        }
        const cardContainer = $cardContainers[userIndex + increasement];
        $(cardContainer).trigger('click');
    };

    /**
     * Invokes API for getting users
     * @param {string} userRequestURL
     */
    getUsers(userRequestURL)
        .then(addUserList);

    // Added event listeners
    $('body').on('click', '.card', displayUserModal);
    $('.modal-close-btn').on('click', closeModal);
    $('#serach-submit').on('click', searchUser);
    $('.btn').on('click', showUser);
});