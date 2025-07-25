import { Global } from "@emotion/react";

const GlobalCss = () => {
  return (
    <Global
      styles={`
            body {
              background: #fafafa;
              transition: padding-right 0.3s;
              overflow-y: scroll !important;
              padding-right: 0px !important;
              font-family: 'Source Sans Pro', sans-serif;
            }
            header{
              padding-right: 0px !important;
            }
            a{
              text-decoration: none !important;
              color: inherit !important;
            }
            a,
            a:hover, button, button:hover, input[type="submit"],input[type="submit"]:hover] {
                transition: all 0.4s ease-in-out;
            }
            p{
              margin: 0;
            }
            span {
              background-color: transparent !important;
              margin: 0;
            }
            textarea {
              resize: none !important;
            }
            .feedContainer{
              background:white;
            }
            html::-webkit-scrollbar {
              width: 4px;
              height: 4px;
            }
            html::-webkit-scrollbar-track {
              background: #e5e5e5;
            }
            html::-webkit-scrollbar-thumb {
              background: #d1d1d1;
              border-radius: 50px;
            }
            .main_btn{
              height: 40px !important;
              min-width: 100px !important;
              background: #fff !important;
              color: #0d6efd !important;
							text-transform: capitalize !important;
              padding: 0px 10px !important;
              transition: 0.3s ease all;
              border: 1px solid #0d6efd !important;
              border-radius: 5px !important;
              font-size: 12px !important;
              font-weight: 600 !important;
            }
            .main_btn:hover{
              background: #0d6efd !important;
              color: white !important;
              border: 1px solid #0d6efd !important;
            }
            .main_btn.active{
              background: #0d6efd !important;
              color: white !important;
            }
            .close_btn{
              height: 40px !important;
              min-width: 75px !important;
              background: #fff !important;
              color: #0d6efd !important;
							text-transform: capitalize !important;
              padding: 0px 10px !important;
              transition: 0.3s ease all;
              border: none !important;
              border-radius: 5px !important;
              font-size: 12px !important;
              font-weight: 600 !important;
            }
            .close_btn:hover{
              background: #0d6efd !important;
              color: white !important;
            }
            .logo{
              width: 40px;
              height: 40px;
            }
            .navbar_wrapper{
              position: fixed !important;
              height: 65px;
              background-color: white !important;
              box-shadow: none !important;
              justify-content: center;
              border-bottom: 1px solid #ccc !important;
            }
            .navbar_icon_wrapper{
              display: flex;
              gap: 20px;
            }
            .nav_search_box_res{
              display: none;
              width: 100%;
            }
            .logo_search_wrapper{
              width: 75%;
            }
            .nav_search_box_large{
              width: 100%;
            }
            .nav_search_box_large input{
              width: 100%;
              padding: 10px 15px;
              border: none;
              outline: none;
              border-radius: 10px;
              border: 1px solid #ccc;
              font-size: 14px;
            }
            .nav_search_box_large input::placeholder{
              font-size: 13px;
            }
            .search_wrapper{
              position: absolute;
              top: 50px;
              background-color: white;
              border-radius: 10px;
              padding: 10px;
              width: 300px;
              z-index: 1;
              border: 1px solid #ccc;
            }
            .employee_name_wrapper{
              padding: 5px 0px;
              borderBottom: 1px solid #ccc;
              cursor: pointer;
            }
            .profile_avatar_button{
              padding: 0px !important;
            }
            .avatar_wrapper{
              border-radius: 50%;
              border: 3px solid #d2e2f0;
            }
            .profile_avatar_menuitem{
              text-decoration: none;
							color: #000000;
            }
            .profile_avatar_menuitem svg{
              min-width: 30px;
              margin-right: 10px;
            }
            .navitem{
              margin: 10px 0px;
              gap: 15px;
              text-transform: capitalize !important;
              transition: 0.3s ease all;
              border-radius: 5px;
              padding: 10px 10px !important;
            }
            .active .navitem{
              background-color: #edf3f8;
            }
            .active .navitem svg{
              color: #f6b710;
            }
            .active.home_link svg{
              color: #f6b710;
            }
            .navitem_icon{
              color: #666666;
            }
            .navitem_icon svg{
              font-size: 32px;
            }
            .navitem:hover{
              background-color: #edf3f8;
            }
            .menu_wrapper hr{
              margin: 0px !important;
            }
            .menu_item{
              text-transform: capitalize !important;
              display: flex;
              gap:10px;
              padding: 5px 10px!important;
            }
            .menu_item:hover{
              background-color: #f1f1f1 !important;
            }
            .menu_item p{
              font-size: 14px;
              font-weight: 500;
              color: #473f3f;
            }
            .menu_item a{
              font-size: 14px;
              font-weight: 500;
              color: #473f3f;
            }
            .profile_avatar_menuitem p{
              text-transform: capitalize !important;
              font-size: 14px;
              font-weight: 600;
            }
            .MuiAutocomplete-option{
              font-size: 14px;
            }
            .outlate_container{
              padding: 0px 10px;
              margin-top: 75px;
            }
            .loader_wrapper{
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: white;
              height: calc(100vh - 90px);
              border-radius: 10px;
            }
            .error_wrapper{
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: white;
              height: calc(100vh - 90px);
              border-radius: 10px;
            }
            .nav_responsive_wrapper{
              width: 25%;
              display: flex;
              align-items: center;
              justify-content: flex-end;
            }
            .notification_box_wrapper{
              position: absolute;
              top: 65px;
              background-color: white;
              padding: 5px 5px 5px 0px !important;
              border: 1px solid #ccc;
              border-radius: 10px;
            }
            .notification_box{
              z-index: 10;
              padding: 0px;
              width: 330px;
              height: calc(100vh - 100px);
              overflow-y: auto;
              display: flex;
              flex-direction: column;
              justify-content: center;
              items-center: center;
              border-radius: 10px;
            }
            .notification_box ul{
              padding: 0px;
              width: 100%;
              border-radius: 10px;
            }
            .notification_box li{
              padding: 5px 10px;
              border-radius: 0px;
              margin-bottom: 0px;
              transition: 0.3s ease all;
            }
            .notification_box li:hover{
              background-color: #edf3f8;
            }
            .notification_box .notification_text{
              padding: 10px;
              background-color: #edf3f8;
              color: #414141;
              font-weight: 500;
              margin-bottom: 0px;
              border-radius: 10px;
            }
            .notification_box::-webkit-scrollbar {
              width: 4px;
              height: 4px;
            }
            .notification_box::-webkit-scrollbar-track {
              background: #e5e5e5;
            }
            .notification_box::-webkit-scrollbar-thumb {
              background: #d1d1d1;
              border-radius: 50px;
            }
            .notification_count{
              height: 15px;
              width: 15px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
              border-radius: 50px;
              background-color: red;
              position: absolute;
              top: -5px;
              right: -5px;
            }
            .notification_wrapper{
              height: 100%;
            }
            .notification_status{
              width: 12px;
              height: 12px;
              border-radius: 50%;
              background-color: #0d6efd;
            }
            .notification_profile_icon{
              position: relative;
            }
            .notification_profile_icon_wrapper{
              position: absolute;
              bottom: 0;
              right: 10px;
              width: 20px;
              height: 20px;
              color: white;
              border-radius: 50px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .notification_profile_icon_wrapper svg{
              font-size: 14px;
            }
            .anonymous_feedback_inner{
              background-color: #0d6efd !important;
              padding: 15px;
              border-radius: 5px 5px 0px 0px !important;
              border: 1px solid #ccc;
            }
            .option_text label span{
              font-size: 14px
            }
            .notification_icon_wrapper{
              padding: 5px;
              border-radius: 50px;
              color: #0d6efd;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .page_not_found_wrapper{
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              height: 80vh;
              text-align: center;
              border-radius: 10px;
            }
            .page_not_found_wrapper_inner{
              width: 80%;
              border-radius: 10px;
              padding: 50px 20px;
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            .card_media_image{
              height: 200px;
              width: 200px !important;
              object-fit: cover;
            }
            .loading_wrapper{
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              background: #f0f0f0;
            }
            input:-internal-autofill-selected {
              background-color: transparent !important;
              -webkit-box-shadow: 0 0 0px 1000px white inset !important; /* Keeps input field background the same as before */
              box-shadow: 0 0 0px 1000px white inset !important;
            }
            input:-webkit-autofill {
              background-color: transparent !important;
              -webkit-box-shadow: 0 0 0 1000px white inset !important; /* Replace white' with your input background color */
              box-shadow: 0 0 0 1000px white inset !important;
            }
            .MuiSlider-colorPrimary span{
              background-color: #ffffff !important;
            }
            .hamburger_menu{
              position: absolute;
              top: 65px;
              left: 10px;
              width: 350px;
              padding: 10px;
              z-index: 1300;
              border-radius: 10px !important;
            }
            .right_btn_wrapper{
              width: 100%;
              display: flex;
              justify-content: end;
            }
            .from_control{
              margin-top: 10px;
            }
            .no_notification{
              text-align: center;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100%;
            }
            .no_notification:hover{
              background-color: white !important;
            }
            .listItem_notification_wrapper{
              margin-bottom: 10px;
              padding: 10px;
              cursor: pointer;
              display: flex;
              border-radius: 10px;
              align-items: center;
              border-bottom: 1px solid #ccc;
            }
            .drawer_wrapper {
              width: 600px;
              height: 100%
            }
            .ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options{
              background-color: white !important;
            }
            // media Query globally
            @media only screen and (max-width: 1023px) {
              .nav_search_box_res{
                display: flex;
                align-items: center;
              }
              .nav_search_box_large{
                display: none;
              }
              .navbar_icon_wrapper{
                display: flex;
                gap: 10px;
              }
              .main_btn{
                min-width: 85px !important;
              }
              .nav_responsive_wrapper{
                justify-content: flex-end;
              }
              .hamburger_menu{
                left: 0;
                width: 100%;
              }
              .home_link{
                display: none;
              }
              .notification_link_text{
                display: none;
              }
              .drawer_wrapper {
                width: 100%;
              }
            }
            @media (min-width: 768px) and (max-width: 1023px) {
                
              }
            @media (min-width: 980px) and (max-width: 1023px) {
              }
        `}
    />
  );
};

export default GlobalCss;
