/*--------------------------------------
    Bootstrap Notify Notifications
---------------------------------------*/
function notify(from, align, icon, type, animIn, animOut){
    $.notify({
        icon: icon,
        title: ' Bootstrap Notify',
        message: 'Turning standard Bootstrap alerts into awesome notifications',
        url: ''
    },{
        element: 'body',
        type: type,
        allow_dismiss: true,
        placement: {
            from: from,
            align: align
        },
        offset: {
            x: 15, // Keep this as default
            y: 15  // Unless there'll be alignment issues as this value is targeted in CSS
        },
        spacing: 10,
        z_index: 1031,
        delay: 2500,
        timer: 1000,
        url_target: '_blank',
        mouse_over: false,
        animate: {
            enter: animIn,
            exit: animOut
        },
        template:   '<div data-notify="container" class="alert alert-dismissible alert-{0} alert--notify" role="alert">' +
                        '<span data-notify="icon"></span> ' +
                        '<span data-notify="title">{1}</span> ' +
                        '<span data-notify="message">{2}</span>' +
                        '<div class="progress" data-notify="progressbar">' +
                            '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                        '</div>' +
                        '<a href="{3}" target="{4}" data-notify="url"></a>' +
                        '<button type="button" aria-hidden="true" data-notify="dismiss" class="alert--notify__close">Close</button>' +
                    '</div>'
    });
}

$('.notifications-demo > .btn').click(function(e){
    e.preventDefault();
    var nFrom = $(this).attr('data-from');
    var nAlign = $(this).attr('data-align');
    var nIcons = $(this).attr('data-icon');
    var nType = $(this).attr('data-type');
    var nAnimIn = $(this).attr('data-animation-in');
    var nAnimOut = $(this).attr('data-animation-out');

    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut);
});


/*--------------------------------------
    Sweet Alert Dialogs
---------------------------------------*/

// Basic
$('#sa-basic').click(function(){
    swal({
        title: "Here's a message!",
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lorem erat, tincidunt vitae ipsum et, pellentesque maximus enim. Mauris eleifend ex semper, lobortis purus sed, pharetra felis',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-primary'
    })
});

// Success Message
$('#sa-success').click(function(){
    swal({
        title: 'Good job!',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lorem erat, tincidunt vitae ipsum et, pellentesque maximus enim. Mauris eleifend ex semper, lobortis purus sed, pharetra felis',
        type: 'success',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-primary'
    })
});

// Success Message
$('#sa-info').click(function(){
    swal({
        title: 'Information!',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lorem erat, tincidunt vitae ipsum et, pellentesque maximus enim. Mauris eleifend ex semper, lobortis purus sed, pharetra felis',
        type: 'info',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-primary'
    })
});

// Warning Message
$('#sa-warning').click(function(){
    swal({
        title: 'Not a good sign...',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lorem erat, tincidunt vitae ipsum et, pellentesque maximus enim. Mauris eleifend ex semper, lobortis purus sed, pharetra felis',
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-primary'
    })
});

// Question Message
$('#sa-question').click(function(){
    swal({
        title: 'Hmm.. what did you say?',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lorem erat, tincidunt vitae ipsum et, pellentesque maximus enim. Mauris eleifend ex semper, lobortis purus sed, pharetra felis',
        type: 'question',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-primary'
    })
});

// Warning Message with function
$('#sa-funtion').click(function(){
    swal({
        title: 'Are you sure?',
        text: 'You will not be able to recover this imaginary file!',
        type: 'warning',
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-danger',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonClass: 'btn btn-secondary'
    }).then(function(){
        swal({
            title: 'Are you sure?',
            text: 'You will not be able to recover this imaginary file!',
            type: 'success',
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-primary'
        });
    });
});

// Custom Image
$('#sa-image').click(function(){
    swal({
        title: 'Sweet!',
        text: "Here's a custom image.",
        imageUrl: 'demo/img/thumbs-up.png',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-primary',
        confirmButtonText: 'Super!'
    });
});

// Auto Close Timer
$('#sa-timer').click(function(){
    swal({
        title: 'Auto close alert!',
        text: 'I will close in 2 seconds.',
        timer: 2000,
        showConfirmButton: false
    });
});
