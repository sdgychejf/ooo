"use client";

import { useEffect } from "react";
import Script from "next/script";
import "./styles.css";

export default function HomeworkPage() {
  useEffect(() => {
    // 在组件加载后执行初始化函数
    if (typeof window !== "undefined") {
      const initFunctions = () => {
        // 加载动画
        setTimeout(() => {
          const loader = document.querySelector(".loader");
          if (loader) {
            loader.classList.add("fade-out");
          }
        }, 1500);

        // 初始化标签切换
        const tabBtns = document.querySelectorAll(".tab-btn");
        const guideContents = document.querySelectorAll(".guide-content");

        tabBtns.forEach((btn) => {
          btn.addEventListener("click", () => {
            tabBtns.forEach((b) => b.classList.remove("active"));
            guideContents.forEach((c) => c.classList.remove("active"));

            btn.classList.add("active");
            const tabId = btn.getAttribute("data-tab");
            if (tabId) {
              const content = document.getElementById(tabId);
              if (content) content.classList.add("active");
            }
          });
        });

        // 初始化导航栏滚动效果
        const header = document.querySelector("header");
        const navLinks = document.querySelectorAll(".nav-links a");

        window.addEventListener("scroll", () => {
          if (header) {
            if (window.scrollY > 100) {
              header.style.boxShadow = "0 2px 15px rgba(0, 0, 0, 0.2)";
              header.style.background = "rgba(255, 255, 255, 0.95)";
            } else {
              header.style.boxShadow = "0 2px 15px rgba(0, 0, 0, 0.1)";
              header.style.background = "rgba(255, 255, 255, 1)";
            }
          }

          // 高亮当前部分导航
          const sections = document.querySelectorAll("section");
          let current = "";
          sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 300) {
              current = section.getAttribute("id") || "";
            }
          });

          navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
              link.classList.add("active");
            }
          });
        });

        // 初始化移动菜单
        const menuBtn = document.querySelector(".mobile-menu-btn");
        const mobileNavLinks = document.querySelector(".nav-links");

        if (menuBtn && mobileNavLinks) {
          menuBtn.addEventListener("click", function () {
            mobileNavLinks.classList.toggle("active");
            const icon = menuBtn.querySelector("i");
            if (icon) {
              icon.classList.toggle("fa-bars");
              icon.classList.toggle("fa-times");
            }
          });
        }

        // 初始化地图
        const initMap = () => {
          const mapElement = document.getElementById("china-map");
          if (mapElement && window.echarts) {
            const chart = window.echarts.init(mapElement);

            // 地图配置
            const option = {
              tooltip: {
                trigger: "item",
                formatter: "{b}<br/>热门景点: {c}",
              },
              visualMap: {
                min: 0,
                max: 100,
                text: ["高", "低"],
                realtime: false,
                calculable: true,
                inRange: {
                  color: [
                    "#e0f3f8",
                    "#abd9e9",
                    "#74add1",
                    "#4575b4",
                    "#313695",
                  ],
                },
              },
              series: [
                {
                  name: "热门景点",
                  type: "map",
                  map: "china",
                  emphasis: {
                    label: {
                      show: true,
                    },
                  },
                  data: [
                    { name: "北京", value: 95 },
                    { name: "上海", value: 90 },
                    { name: "广东", value: 88 },
                    { name: "四川", value: 85 },
                    { name: "陕西", value: 80 },
                    { name: "浙江", value: 78 },
                    { name: "江苏", value: 75 },
                    { name: "云南", value: 70 },
                    { name: "海南", value: 68 },
                    { name: "福建", value: 65 },
                  ],
                },
              ],
            };

            chart.setOption(option);

            // 响应式调整
            window.addEventListener("resize", function () {
              chart.resize();
            });
          }
        };

        // 初始化日期选择器
        const datepicker = document.getElementById("datepicker");
        if (datepicker && window.flatpickr) {
          window.flatpickr(datepicker, {
            mode: "range",
            minDate: "today",
            dateFormat: "Y-m-d",
            locale: "zh",
          });
        }

        // 初始化地图
        if (document.getElementById("china-map")) {
          initMap();
        }
      };

      initFunctions();
    }
  }, []);

  return (
    <div className="homework-page">
      {/* 加载动画 */}
      <div className="loader">
        <div className="plane">
          <i className="fas fa-plane"></i>
        </div>
      </div>

      {/* 导航栏 */}
      <header>
        <div className="container">
          <nav>
            <a href="#" className="logo">
              <i className="fas fa-map-marked-alt"></i>畅游中国
            </a>
            <button className="mobile-menu-btn">
              <i className="fas fa-bars"></i>
            </button>
            <ul className="nav-links">
              <li>
                <a href="#home" className="active">
                  首页
                </a>
              </li>
              <li>
                <a href="#destinations">热门目的地</a>
              </li>
              <li>
                <a href="#guides">旅游攻略</a>
              </li>
              <li>
                <a href="#testimonials">用户评价</a>
              </li>
              <li>
                <a href="#plans">出行方案</a>
              </li>
              <li>
                <a href="#about">关于我们</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* 英雄区域 */}
      <section className="hero" id="home">
        <div className="hero-content">
          <h1>发现中国的美丽</h1>
          <p>
            为您提供全国最全面的旅游规划服务，从城市到乡村，从高山到大海，一站式解决您的旅行需求
          </p>
          <div className="search-box">
            <div className="search-field">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="想去哪里玩？" />
            </div>
            <div className="search-field">
              <i className="fas fa-calendar-alt"></i>
              <input type="text" id="datepicker" placeholder="选择日期" />
            </div>
            <button className="btn btn-primary">搜索</button>
          </div>
        </div>
      </section>

      {/* 热门目的地 */}
      <section className="section destinations" id="destinations">
        <div className="container">
          <div className="section-title">
            <h2>热门目的地</h2>
            <p>探索中国最受欢迎的旅游城市和景点</p>
          </div>
          <div className="destinations-grid">
            {/* 目的地卡片 */}
            <div className="destination-card">
              <div className="destination-img">
                <img
                  src="https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b"
                  alt="北京"
                />
                <div className="destination-badge">热门</div>
                <div className="destination-overlay">
                  <a href="#" className="btn btn-outline">
                    查看详情
                  </a>
                </div>
              </div>
              <div className="destination-info">
                <div className="rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star-half-alt"></i>
                  <span>4.8</span>
                </div>
                <h3>北京</h3>
                <p>中国的首都，融合了古老文化和现代文明</p>
                <div className="destination-meta">
                  <span>
                    <i className="fas fa-map-marker-alt"></i> 华北地区
                  </span>
                  <span>
                    <i className="fas fa-clock"></i> 3-5天
                  </span>
                </div>
              </div>
            </div>
            {/* 更多目的地卡片... */}
          </div>
        </div>
      </section>

      {/* 旅游攻略 */}
      <section className="section guides" id="guides">
        <div className="container">
          <div className="section-title">
            <h2>旅游攻略</h2>
            <p>专业旅行者分享的实用信息和经验</p>
          </div>
          {/* 攻略内容... */}
        </div>
      </section>

      {/* 用户评价 */}
      <section className="section testimonials" id="testimonials">
        <div className="container">
          <div className="section-title">
            <h2>用户评价</h2>
            <p>听听旅行者们的真实体验</p>
          </div>
          {/* 评价内容... */}
        </div>
      </section>

      {/* 中国地图 */}
      <section className="section map-section">
        <div className="container">
          <div className="section-title">
            <h2>探索中国</h2>
            <p>点击地图探索各地旅游资源</p>
          </div>
          <div id="china-map" style={{ height: "500px" }}></div>
        </div>
      </section>

      {/* 页脚 */}
      <footer id="about">
        <div className="container">
          <div className="footer-content">{/* 页脚内容... */}</div>
          <div className="copyright">
            <p>&copy; 2023 畅游中国旅游规划平台. 保留所有权利.</p>
          </div>
        </div>
      </footer>

      {/* 外部脚本 */}
      <Script
        src="https://cdn.jsdelivr.net/npm/flatpickr"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/flatpickr/dist/l10n/zh.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/echarts@5.4.2/dist/echarts.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/echarts@5.4.2/map/js/china.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/js/all.min.js"
        strategy="beforeInteractive"
      />
    </div>
  );
}
