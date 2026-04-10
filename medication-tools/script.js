
    (function(){
        // ===================== CREDENTIALS =====================
        const AUTHORIZED_USERS = ["Brian254", "Ian@21", "Muhidin389", "Leshan3829", "Antoniner3637"];
        const MASTER_PASSWORD = "BMI@21";
        // LOGIN DETAILS:
        // Usernames: Brian254, Ian@21, Muhidin389, Leshan3829, Antoniner3637
        // Shared Password: BMI@21
        // Each user starts with 1000 shares @ 2 KES each.

        // localStorage keys
        const STORAGE_USERS = "sdgz_advanced_portfolio";
        const SESSION_KEY = "sdgz_auth_session";
        const POSTS_KEY = "sdgz_social_boosts";   // store submitted links
        const BONUS_LOG_KEY = "sdgz_bonus_records";
        const ACTIVITY_LOG_KEY = "sdgz_activity_log";
        
        // Global state
        let currentUser = null;
        let currentPrice = 2.00;
        let priceHistory = [];
        let priceInterval = null;
        let canvas;
        
        // Extended stocks for realism
        let otherStocks = [
            { name: "Afya AI Tech", symbol: "AFYA", price: 12.45, prevPrice: 12.45, changePercent: 0 },
            { name: "Genomics Kenya", symbol: "GNK", price: 7.80, prevPrice: 7.80, changePercent: 0 },
            { name: "Medilink Digital", symbol: "MDL", price: 23.15, prevPrice: 23.15, changePercent: 0 }
        ];
        
        // news & sentiment
        const advancedNews = [
            "📰 SEC clears SmartDoctor GenZ's AI diagnostic tool for EU market expansion.",
            "⚡ Analyst upgrade: SDGZ target raised to 3.8 KES on strong user growth.",
            "🏥 SmartDoctor partners with 5 new hospitals in Nairobi & Mombasa.",
            "📊 Whale accumulation detected: institutional buy order of 250k shares.",
            "🌍 African Union endorses AI health platforms: SmartDoctor leads index.",
            "🔥 Short squeeze incoming? Borrow rate spikes on SDGZ."
        ];
        
        // Helper: load user portfolio
        function loadPortfolio(user) {
            let data = JSON.parse(localStorage.getItem(STORAGE_USERS) || "{}");
            if (!data[user]) {
                data[user] = { shares: 1000, bonusHistory: [], totalBonus: 0 };
                localStorage.setItem(STORAGE_USERS, JSON.stringify(data));
            }
            return data[user];
        }
        
        function savePortfolio(user, portfolioObj) {
            let data = JSON.parse(localStorage.getItem(STORAGE_USERS) || "{}");
            data[user] = portfolioObj;
            localStorage.setItem(STORAGE_USERS, JSON.stringify(data));
        }
        
        function addActivity(user, message) {
            let logs = JSON.parse(localStorage.getItem(ACTIVITY_LOG_KEY) || "[]");
            logs.unshift({ time: new Date().toLocaleTimeString(), text: message, user: user });
            if (logs.length > 40) logs.pop();
            localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(logs));
            if (currentUser === user) renderActivityLog();
        }
        
        function renderActivityLog() {
            const container = document.getElementById("transactionHistory");
            if (!container) return;
            let logs = JSON.parse(localStorage.getItem(ACTIVITY_LOG_KEY) || "[]");
            let userLogs = logs.filter(l => l.user === currentUser);
            if (userLogs.length === 0) { container.innerHTML = "📭 No recent activity — start engaging!"; return; }
            container.innerHTML = userLogs.map(l => `🕒 ${l.time}  •  ${l.text}`).join('<br>');
        }
        
        function addBonusRecord(user, text) {
            let records = JSON.parse(localStorage.getItem(BONUS_LOG_KEY) || "[]");
            records.unshift({ time: new Date().toLocaleString(), msg: text, user });
            if (records.length > 20) records.pop();
            localStorage.setItem(BONUS_LOG_KEY, JSON.stringify(records));
            if (currentUser === user) renderBonusHistory();
        }
        
        function renderBonusHistory() {
            let container = document.getElementById("bonusHistory");
            if (!container) return;
            let records = JSON.parse(localStorage.getItem(BONUS_LOG_KEY) || "[]");
            let userRecords = records.filter(r => r.user === currentUser);
            if (userRecords.length === 0) { container.innerHTML = "🏅 No bonus shares awarded yet."; return; }
            container.innerHTML = userRecords.map(r => `✨ ${r.time} → ${r.msg}`).join('<br>');
        }
        
        // Display submitted links for current user
        function renderSubmittedLinks() {
            const container = document.getElementById("linksList");
            if (!container) return;
            let allLinks = JSON.parse(localStorage.getItem(POSTS_KEY) || "[]");
            let userLinks = allLinks.filter(l => l.user === currentUser);
            if (userLinks.length === 0) {
                container.innerHTML = "No links submitted yet. Share your campaign link above.";
                return;
            }
            container.innerHTML = userLinks.map(link => `
                <div style="border-bottom:1px solid #2A3456; padding: 10px 0;">
                    <div style="word-break:break-all;">🔗 ${link.link.substring(0, 70)}${link.link.length > 70 ? '...' : ''}</div>
                    <div class="flex-between" style="margin-top: 6px;">
                        <span style="font-size:0.7rem;">📅 ${new Date(link.timestamp).toLocaleString()}</span>
                        <span class="${link.status === 'pending' ? 'badge-pending' : 'badge-approved'}">${link.status === 'pending' ? '⏳ Monitoring traction' : '✅ Bonus Awarded'}</span>
                    </div>
                    ${link.bonusGiven ? `<span style="font-size:0.7rem; color:#2DD4BF;">🎁 +${link.bonusAmount} shares awarded</span>` : ''}
                </div>
            `).join('');
        }
        
        // Price fluctuation engine
        function fluctuatePrices() {
            let change = (Math.random() - 0.5) * 0.32;
            let newPrice = currentPrice + change;
            if (newPrice < 0.6) newPrice = 0.6 + Math.random() * 0.3;
            if (newPrice > 7.2) newPrice = 7.0;
            currentPrice = parseFloat(newPrice.toFixed(3));
            priceHistory.push(currentPrice);
            if (priceHistory.length > 55) priceHistory.shift();
            
            // Update other stocks
            for (let i = 0; i < otherStocks.length; i++) {
                let stock = otherStocks[i];
                let delta = (Math.random() - 0.5) * 0.55;
                let newVal = stock.price + delta;
                if (newVal < 1.5) newVal = 1.5;
                if (newVal > 45) newVal = 45;
                stock.prevPrice = stock.price;
                stock.price = parseFloat(newVal.toFixed(2));
                stock.changePercent = ((stock.price - stock.prevPrice) / stock.prevPrice * 100).toFixed(2);
            }
            
            if (Math.random() < 0.25) {
                let randomHeadline = advancedNews[Math.floor(Math.random() * advancedNews.length)];
                document.getElementById("breakingNewsFeed").innerHTML = `📡 BREAKING: ${randomHeadline}`;
                document.getElementById("newsFlash").innerHTML = `📢 ${randomHeadline} <span style="font-size:0.7rem;">(impact: ±${(Math.random()*2).toFixed(1)}%)</span>`;
                addActivity(currentUser, `Market news: ${randomHeadline.substring(0, 70)}`);
            }
            updateDashboardUI();
            drawGraph();
        }
        
        function updateDashboardUI() {
            if (!currentUser) return;
            let portfolio = loadPortfolio(currentUser);
            let sharesOwned = portfolio.shares;
            let totalValue = sharesOwned * currentPrice;
            document.getElementById("livePrice").innerHTML = `${currentPrice.toFixed(2)} KES`;
            document.getElementById("userShares").innerHTML = sharesOwned;
            document.getElementById("portfolioValue").innerHTML = totalValue.toFixed(2);
            document.getElementById("priceLiveLabel").innerHTML = `${currentPrice.toFixed(2)} KES`;
            let changeFromPrev = priceHistory.length > 1 ? ((currentPrice - priceHistory[priceHistory.length-2]) / priceHistory[priceHistory.length-2] * 100).toFixed(2) : 0;
            let indicatorDiv = document.getElementById("priceChangeIndicator");
            if (changeFromPrev >= 0) {
                indicatorDiv.innerHTML = `📈 +${changeFromPrev}% (bullish)`;
                indicatorDiv.className = "green-text";
            } else {
                indicatorDiv.innerHTML = `📉 ${changeFromPrev}% (bearish)`;
                indicatorDiv.className = "red-text";
            }
            
            let portHtml = `<div class="flex-between"><span>🧬 SmartDoctor GenZ shares:</span><span style="font-weight:800;">${sharesOwned} shares</span></div>
            <div class="flex-between"><span>💎 Current market price:</span><span>${currentPrice.toFixed(2)} KES</span></div>
            <div class="flex-between"><span>💵 Portfolio exposure:</span><span>${totalValue.toFixed(2)} KES</span></div>
            <div class="flex-between"><span>📈 All-time P&L (since start):</span><span>${((currentPrice - 2) * sharesOwned).toFixed(2)} KES</span></div>`;
            document.getElementById("portfolioDetails").innerHTML = portHtml;
            
            let multiHtml = "";
            otherStocks.forEach(st => {
                let col = st.changePercent >= 0 ? "green-text" : "red-text";
                multiHtml += `<div class="stat-card"><div>${st.name} (${st.symbol})</div><div class="stat-value">${st.price} KES</div><div class="${col}">${st.changePercent}%</div><span style="font-size:0.7rem;">24h vol: ${(Math.random()*80+20).toFixed(0)}K</span></div>`;
            });
            if (document.getElementById("multiStockList")) document.getElementById("multiStockList").innerHTML = multiHtml;
        }
        
        function drawGraph() {
            if (!canvas || priceHistory.length === 0) return;
            const w = canvas.clientWidth;
            const h = 320;
            canvas.width = w;
            canvas.height = h;
            const ctxCanvas = canvas.getContext("2d");
            ctxCanvas.clearRect(0, 0, w, h);
            if (priceHistory.length < 2) return;
            let minP = Math.min(...priceHistory, 0.6);
            let maxP = Math.max(...priceHistory, 3.5);
            let stepX = w / (priceHistory.length - 1);
            ctxCanvas.beginPath();
            ctxCanvas.strokeStyle = "#2DD4BF";
            ctxCanvas.lineWidth = 2.8;
            for (let i = 0; i < priceHistory.length; i++) {
                let x = i * stepX;
                let y = h - ((priceHistory[i] - minP) / (maxP - minP)) * (h - 40) - 20;
                if (i === 0) ctxCanvas.moveTo(x, y);
                else ctxCanvas.lineTo(x, y);
            }
            ctxCanvas.stroke();
            ctxCanvas.fillStyle = "rgba(45, 212, 191, 0.08)";
            ctxCanvas.lineTo(w, h);
            ctxCanvas.lineTo(0, h);
            ctxCanvas.fill();
        }
        
        // Rewards: Submit link WITHOUT auto bonus
        function initRewardsModule() {
            const submitBtn = document.getElementById("submitBoostBtn");
            const simBonus = document.getElementById("simulateBonusBtn");
            
            submitBtn.onclick = () => {
                let link = document.getElementById("boostLink").value.trim();
                if (!link) { document.getElementById("boostMessage").innerHTML = "❌ Please paste a valid post link."; return; }
                let boosts = JSON.parse(localStorage.getItem(POSTS_KEY) || "[]");
                boosts.push({ 
                    user: currentUser, 
                    link: link, 
                    timestamp: Date.now(), 
                    status: "pending",
                    bonusGiven: false,
                    bonusAmount: 0
                });
                localStorage.setItem(POSTS_KEY, JSON.stringify(boosts));
                document.getElementById("boostMessage").innerHTML = "✅ Link submitted successfully! Our team will monitor post traction (likes, shares, comments) and award bonus shares accordingly within 24-48 hours.";
                document.getElementById("boostLink").value = "";
                addActivity(currentUser, `Submitted campaign link for review: ${link.substring(0, 50)}...`);
                renderSubmittedLinks();
                // auto-clear message after 5 sec
                setTimeout(() => { document.getElementById("boostMessage").innerHTML = ""; }, 5000);
            };
            
            // Manual bonus award by "admin" simulation (realistic: manager awards based on performance)
            simBonus.onclick = () => {
                let extra = Math.floor(Math.random() * 85) + 20;
                let portfolio = loadPortfolio(currentUser);
                portfolio.shares += extra;
                if (!portfolio.bonusHistory) portfolio.bonusHistory = [];
                portfolio.bonusHistory.push(`Exec recognition: +${extra} shares`);
                savePortfolio(currentUser, portfolio);
                addBonusRecord(currentUser, `🏅 Performance award: ${extra} free shares for outstanding work & commitment.`);
                addActivity(currentUser, `⭐ Awarded ${extra} bonus shares for good work!`);
                updateDashboardUI();
            };
            
            renderSubmittedLinks();
            renderBonusHistory();
        }
        
        // Authentication
        function initAuth() {
            const loginBtn = document.getElementById("doLoginBtn");
            const userInput = document.getElementById("loginUsername");
            const passInput = document.getElementById("loginPassword");
            const errSpan = document.getElementById("loginError");
            loginBtn.onclick = () => {
                let user = userInput.value.trim();
                let pwd = passInput.value;
                if (AUTHORIZED_USERS.includes(user) && pwd === MASTER_PASSWORD) {
                    currentUser = user;
                    localStorage.setItem(SESSION_KEY, user);
                    let portData = JSON.parse(localStorage.getItem(STORAGE_USERS) || "{}");
                    if (!portData[user]) portData[user] = { shares: 1000, bonusHistory: [] };
                    localStorage.setItem(STORAGE_USERS, JSON.stringify(portData));
                    showDashboard();
                    addActivity(currentUser, "✅ Logged into SmartDoctor Pro dashboard.");
                } else {
                    errSpan.innerText = "❌ Access denied: invalid credentials or unauthorized user.";
                }
            };
            let cachedSession = localStorage.getItem(SESSION_KEY);
            if (cachedSession && AUTHORIZED_USERS.includes(cachedSession)) {
                currentUser = cachedSession;
                showDashboard();
                addActivity(currentUser, "Session resumed automatically.");
            }
        }
        
        function showDashboard() {
            document.getElementById("authContainer").style.display = "none";
            document.getElementById("dashboardApp").style.display = "block";
            document.getElementById("dashboardUser").innerHTML = currentUser;
            if (priceHistory.length === 0) for (let i = 0; i < 40; i++) priceHistory.push(2.0 + (Math.random() * 0.25));
            currentPrice = priceHistory[priceHistory.length - 1];
            canvas = document.getElementById("stockCanvas");
            if (priceInterval) clearInterval(priceInterval);
            priceInterval = setInterval(() => fluctuatePrices(), 2800);
            updateDashboardUI();
            drawGraph();
            
            const sections = ["overview", "market", "portfolio", "rewards", "trade"];
            function showSection(sectionId) {
                sections.forEach(sec => {
                    let el = document.getElementById(sec + "Section");
                    if (el) el.style.display = sec === sectionId ? "block" : "none";
                });
                document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
                let activeNav = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
                if(activeNav) activeNav.classList.add("active");
            }
            document.querySelectorAll(".nav-item[data-section]").forEach(el => {
                el.onclick = () => showSection(el.getAttribute("data-section"));
            });
            showSection("overview");
            document.getElementById("logoutBtn").onclick = () => {
                localStorage.removeItem(SESSION_KEY);
                location.reload();
            };
            initRewardsModule();
            renderActivityLog();
            renderBonusHistory();
        }
        
        window.addEventListener("load", () => {
            initAuth();
            let allPortfolios = JSON.parse(localStorage.getItem(STORAGE_USERS) || "{}");
            AUTHORIZED_USERS.forEach(u => {
                if (!allPortfolios[u]) allPortfolios[u] = { shares: 1000, bonusHistory: [] };
            });
            localStorage.setItem(STORAGE_USERS, JSON.stringify(allPortfolios));
        });
    })();
