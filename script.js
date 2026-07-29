
// ---------------- SIGNUP FUNCTIONALITY ----------------
const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.getElementById("newUsername").value;
        const password = document.getElementById("newPassword").value;

        // Save user in localStorage
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);

        alert("Signup successful! Please login.");
        window.location.href = "index.html";
    });
}

// ---------------- LOGIN FUNCTIONALITY ----------------
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const storedUsername = localStorage.getItem("username");
        const storedPassword = localStorage.getItem("password");

        if (username === storedUsername && password === storedPassword) {
            alert("Login successful!");
            localStorage.setItem("loggedIn", "true");   // ✅ session flag
            window.location.href = "dashboard.html";   // ✅ redirect
        } else {
            alert("Invalid username or password!");
        }
    });
}

// ---------------- PAGE PROTECTION ----------------
function protectPage() {
    if (!localStorage.getItem("loggedIn")) {
        window.location.href = "index.html";
    }
}

// ---------------- LOGOUT FUNCTION ----------------
function logoutUser() {
    localStorage.removeItem("loggedIn");
    window.location.href = "index.html";
}

// ---------------- MYTH PAGE GENERATION ----------------
const myths = [
  {
    myth: "Periods are dirty and should be hidden.",
    fact: "Menstruation is a natural and healthy process that shows a woman’s body is functioning normally."
  },
  {
    myth: "You should not exercise during your period.",
    fact: "Light to moderate exercise like yoga or walking can actually help reduce cramps and boost mood."
  },
  {
    myth: "You can’t get pregnant during your period.",
    fact: "It is rare but possible — sperm can survive in the body for up to 5 days."
  },
  {
    myth: "PCOS means you can’t have children.",
    fact: "Many women with PCOS conceive naturally or with medical help. Proper treatment and lifestyle changes can improve fertility."
  },
  {
    myth: "Using birth control causes infertility.",
    fact: "Birth control does not cause infertility. Normal fertility usually returns soon after stopping it."
  },
  {
    myth: "Only older women get breast cancer.",
    fact: "While risk increases with age, younger women can also develop breast cancer. Regular self-checks and screenings are important."
  },
  {
    myth: "Tampons can get lost inside the body.",
    fact: "A tampon cannot get lost inside the body because the cervix prevents it from going further. It may just move a bit higher but can be removed easily."
  },
  {
    myth: "All women have regular 28-day menstrual cycles.",
    fact: "Cycle length varies from person to person — anywhere between 21 to 35 days is normal."
  },
  {
    myth: "Menopause happens suddenly.",
    fact: "Menopause is a gradual process that can take years, involving different stages and hormonal changes."
  },
  {
    myth: "Mental health issues like anxiety or depression are just mood swings.",
    fact: "They are real medical conditions that deserve understanding, care, and professional support."
  },

  {
    myth: "Painful periods are normal and should be ignored.",
    fact: "Severe pain may indicate conditions like endometriosis or hormonal issues and should be checked by a doctor."
  },
  {
    myth: "Irregular periods always mean something is seriously wrong.",
    fact: "Stress, diet changes, travel, and lifestyle can affect cycles. However, frequent irregularity should be evaluated."
  },
  {
    myth: "You don’t need a gynecologist unless you are married.",
    fact: "Every woman should visit a gynecologist for routine health checks regardless of age or marital status."
  },
  {
    myth: "Breast lumps always mean cancer.",
    fact: "Many breast lumps are harmless, but any new lump should always be checked by a doctor."
  },
  {
    myth: "White vaginal discharge is always a sign of infection.",
    fact: "Normal discharge helps keep the vagina clean and healthy. Only unusual color, smell, or itching needs medical attention."
  },
  {
    myth: "Pregnancy cannot happen the first time you have sex.",
    fact: "Pregnancy can happen anytime unprotected sex occurs, even the first time."
  },
  {
    myth: "Using sanitary pads or tampons for long hours is safe.",
    fact: "Changing pads or tampons regularly helps prevent infections and irritation."
  },
  {
    myth: "Only overweight women get PCOS.",
    fact: "PCOS can affect women of all body types. Weight is not the only factor."
  },
  {
    myth: "Mood changes during periods mean you are weak.",
    fact: "Hormonal changes affect emotions naturally. It does not mean weakness."
  },
  {
    myth: "Skipping periods is always unhealthy.",
    fact: "Athletes, stress, or certain medical conditions can cause skipped periods, but persistent absence should be checked."
  },
  {
  myth: "Periods should always be exactly the same every month.",
  fact: "Small changes in cycle length, flow, and symptoms are normal due to stress, hormones, and lifestyle."
},
{
  myth: "You cannot swim or bathe during your period.",
  fact: "Bathing and swimming are safe during periods and can help you feel fresh and relaxed."
},
{
  myth: "Eating sour or cold food worsens periods.",
  fact: "There is no scientific proof that specific food temperatures affect menstruation."
},
{
  myth: "Infertility is always caused by women.",
  fact: "Fertility issues can occur in both men and women equally."
},
{
  myth: "You don't need contraception if you track your cycle carefully.",
  fact: "Cycle tracking can reduce risk but is not fully reliable for preventing pregnancy."
},
{
  myth: "Heavy bleeding always means a serious disease.",
  fact: "Flow varies naturally, but very heavy or prolonged bleeding should be medically evaluated."
},
{
  myth: "Menstrual cramps mean your body is weak.",
  fact: "Cramps happen due to uterine muscle contractions and hormonal changes."
},
{
  myth: "Breastfeeding completely prevents pregnancy.",
  fact: "Pregnancy can still occur during breastfeeding if ovulation resumes."
},
{
  myth: "Vaginal itching always means infection.",
  fact: "Itching can also be caused by allergies, dryness, or irritation."
},
{
  myth: "All contraceptives cause weight gain.",
  fact: "Weight changes vary by individual and depend on the type of contraception."
},
{
  myth: "Women should tolerate pelvic pain silently.",
  fact: "Ongoing pelvic pain should never be ignored and deserves medical care."
},
{
  myth: "Hormonal problems only affect older women.",
  fact: "Hormonal imbalances can occur at any age."
},
{
  myth: "Pap smear tests are painful and dangerous.",
  fact: "Pap smears are quick, safe, and help detect cervical problems early."
},
{
  myth: "Period blood is impure or toxic.",
  fact: "Menstrual blood is simply a mix of blood and uterine lining, not harmful."
},
{
  myth: "You cannot exercise during pregnancy.",
  fact: "Safe physical activity during pregnancy improves health unless restricted by a doctor."
},
{
  myth: "Taking painkillers for periods is always harmful.",
  fact: "When used responsibly, pain relief medicines can be safe and effective."
},
{
  myth: "Only married women need reproductive health education.",
  fact: "Every woman benefits from understanding her reproductive health."
},
{
  myth: "Hot baths should be avoided during periods.",
  fact: "Warm baths can ease cramps and relax muscles."
},
{
  myth: "Women naturally tolerate pain better and don't need treatment.",
  fact: "Pain perception varies, and medical care should never be ignored."
},
{
  myth: "Talking about periods in public is inappropriate.",
  fact: "Open discussion helps reduce stigma and improves health awareness."
}

];

// Safe loading: only if myth-container exists on page
const container = document.getElementById("myth-container");

if (container) {
    myths.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
          <h3>Myth: ${item.myth}</h3>
          <p><strong>Fact:</strong> ${item.fact}</p>
        `;
        container.appendChild(card);
    });
}
