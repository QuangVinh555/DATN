import React from 'react';
import "./Footer.scss";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-list">
        <div className="footer-item">
          <h1>Lịch chiếu phim</h1>
          <div className="footer-content">
            <p>Phim đang chiếu</p>
            <p>Phim sắp chiếu</p>
          </div>
        </div>
        <div className="footer-item">
          <h1>Blog điện ảnh</h1>
          <div className="footer-content">
            <p>Phim chiếu rạp</p>
            <p>Top phim</p>
            <p>Phim Netflix</p>
          </div>
        </div>
        <div className="footer-item">
          <h1>Review phim</h1>
          <div className="footer-content">
            <p>Bình luận từ người xem</p>
            <p>Review phim từ MoMo</p>
          </div>
        </div>
        <div className="footer-item">
          <h1>Rạp chiếu phim</h1>
          <div className="footer-content">
            <p>CGV</p>
            <p>Lotte Cinema</p>
            <p>BHD Star</p>
            <p>Galaxy Cinema</p>
            <p>Beta Cinemas</p>
            <p>Cinestar</p>
            <p>DCINE</p>
            <p>MegaGS</p>
            <p>Cinemax</p>
          </div>
        </div>
        <div className="footer-item footer-item-take">
          <h1>CHĂM SÓC KHÁCH HÀNG</h1>
          <div className="footer-content">
            <p>Địa chỉ: Tầng M, Tòa nhà Victory Tower, Số 12 Tân Trào, Phường Tân Phú, Quận 7, Thành phố Hồ Chí Minh</p>
            <p>Hotline: 1900 5454 41 (1000 đ/phút)</p>
            <p>Email: hotro@momo.vn</p>
            <p>Tổng đài gọi ra: 028.7306.5555 - 028.9999.5555</p>
            <div className="footer-content-app">
              <img src="https://static.mservice.io/img/momo-upload-api-210724113855-637627235353131497.jpg" alt="" />
              <img src="https://static.mservice.io/img/momo-upload-api-210724113959-637627235994410679.jpg" alt="" />
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-logo">
          <img src="https://cdn.moveek.com/bundles/ornweb/img/favicon-large.png" alt="" />
          <div className="footer-bottom-info">
            <h1>Công Ty Cổ Phần Dịch Vụ Di Động Trực Tuyến (viết tắt M_Service)</h1>
            <p>Lầu 6, Toà nhà Phú Mỹ Hưng, số 8 Hoàng Văn Thái, khu phố 1, Phường Tân Phú, Quận 7, Thành phố Hồ Chí Minh</p>
          </div>
        </div>
        <div className="footer-bottom-media">
          <div className="footer-bottom-img">
            <img src="https://static.mservice.io/styles/desktop/images/social/facebook.svg" alt="" />
            <img src="https://static.mservice.io/styles/desktop/images/social/linkedin.svg" alt="" />
            <img src="https://static.mservice.io/styles/desktop/images/social/youtube.svg" alt="" />
          </div>
          <div className="footer-bottom-coppy">
            <p>©Copyright M_Service 2023</p>
          </div>
        </div>
        {/* <div className="footer-bottom-signature">
          <p>Chứng nhận bởi</p>
          <img src="" alt="" />
        </div> */}
      </div>
    </div>
  )
}

export default Footer