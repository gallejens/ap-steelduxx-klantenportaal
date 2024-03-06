import '../styles/navbar.module.scss'; 

export const Navbar = () => {
  return (
    <div className="navbar">
      <div className="top-navbar">
        <div className="topnav-item">
          <div className="logo">
            <img src="./steelduxxlogo.png" alt="Company Logo" />
          </div>
        </div>
        <div className="actions">
          <div className="Languague selector">
            <div className="flag">
              <img src="./Belg-flag.png" alt="Belgium flag" />
            </div>
            <div className="lang">NL</div>
          </div>
          <div className="notifications">
            <img src="./chat.png" alt="Chat logo" />
          </div>
        </div>
      </div>
      <div className="left-navbar">
        <div className="nav-items">
          <div className="home-bar">
            <div className="nav-item">
              <div className="left-icon" id="home-icon">
                <img src="./home-blue.png" alt="home-icon" />
              </div>
              <div className="text-left" id="home">Home</div>
            </div>
          </div>
          <div className="order-bar">
            <div className="nav-item">
              <div className="left-icon" id="list-icon">
                <img
                  src="./baseline-density-medium-green.png"
                  alt="order-icon"
                />
              </div>
              <div className="text-left" id="order">Orderlist</div>
            </div>
          </div>
          <div className="reg-bar">
            <div className="nav-item">
              <div className="left-icon" id="reg-icon">
                <img src="./list-pink.png" alt="registration" />
              </div>
              <div className="text-left" id="registration">Registrationlist</div>
            </div>
          </div>
        </div>
        <div className="account-button">
          <div className="button-items">
            <div id="account-pfp">
              <img src="./default-pfp.png" alt="pfp" />
            </div>
            <div id="account-name">Maximilian Duda</div>
            <div id="account-mail">Maximilianduda@gmail.com</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;