$(function () {
    const peicesOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

    let minutes = 1, seconds = 0, startTimer = null;

    const timer = () => {
        const plusZero = a => { return (a < 10) ? a = '0' + a : a }

        startTimer = setInterval(() => {
            if (minutes <= 0 && seconds <= 0) { return checkGame() }
            if (seconds === 0) {
                minutes--;
                seconds = 60;
            }
            seconds--;
            $('.timer').text(`${plusZero(minutes)}:${plusZero(seconds)}`);
            $('.modal__time').text(`${plusZero(minutes)}:${plusZero(seconds)}`);
        }, 1000);
    }

    const resetTimer = () => {
        clearInterval(startTimer);
        minutes = 1;
        seconds = 0;
        $('.timer').text('01:00');
    }

    const mixPazzle = () => {
        let parent = $("#left-area");
        let children = parent.children();
        while (children.length) { parent.append(children.splice(Math.floor(Math.random() * children.length), 1)[0]) }
    }

    const startGame = () => {
        timer();
        $('#start').attr('disabled', true);
        $('#check').attr('disabled', false);
    }

    const checkGame = () => {
        let check = true;
        for (let i = 0; i < $('.piece').length; i++) {
            if ($('#right-area .piece').eq(i).attr('data-order') != peicesOrder[i]) {
                check = false;
                break;
            }
            else { check = true }
        }
        if (check) {
            $('.modal-window').fadeIn();
            $('.modal__text').text("Woohoo, well done, you did it!");
            $('#check_modal').hide();
        }
        else {
            $('.modal-window').fadeIn();
            $('.modal__text').text("It's a pity, but you lost");
            $('#check_modal').hide();
        }
        newGame();
    }

    const newGame = () => {
        resetTimer();
        $('.piece').appendTo('#left-area');
        $('.emptyBox').removeClass('piecePresent');
        mixPazzle();
        $('#check').attr('disabled', true);
        $('#start').attr('disabled', false);
    }

    const createPieces = () => {
        let rows = 4, colums = 4, order = 1, pieces = '', emptyBoxs = '';
        for (let i = 0, top = 0; i < rows; i++, top -= 75) {
            for (let j = 0, left = 0; j < colums; j++, left -= 75, order++) {
                pieces += `<div class="piece" style="background-position: ${left}px ${top}px"
                 data-order="${order}"></div>`;
                emptyBoxs += `<div class="emptyBox"></div>`;
            }
        }
        $('#left-area').html(pieces);
        $('#right-area').html(emptyBoxs);
        mixPazzle();
    }

    createPieces();

    $('.piece').draggable({
        containment: '.container',
        revert: 'invalid',
        cursor: 'grabbing',
        zIndex: 2,
        start: function () {
            if ($('#start').is('[disabled=disabled]') === false) { startGame() }
            if ($(this).hasClass('droppedPiece')) {
                $(this).removeClass('droppedPiece');
                $(this).parent().removeClass('piecePresent');
            }
        },
    });

    $('.emptyBox').droppable({
        hoverClass: 'hoverDrag',
        accept: function () { return !$(this).hasClass('piecePresent') },
        drop: function (event, ui) {
            let dragElem = ui.draggable;
            let droppedOn = $(this);
            droppedOn.addClass('piecePresent');
            dragElem.addClass('droppedPiece').css({ top: 0, left: 0, position: 'relative', }).appendTo(droppedOn);
        }
    })

    $('#start').on('click', startGame);

    $('#check').on('click', () => {
        $('.modal-window').fadeIn();
        $('.modal__text').html('You still have time, you sure? <span class="modal__time">00:00</span>');
        $('#check_modal').show();
    })

    $('#new').on('click', newGame);

    $('#close_modal').on('click', () => { $('.modal-window').fadeOut() })

    $('#check_modal').on('click', checkGame);
})
