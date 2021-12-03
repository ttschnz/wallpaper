const wallpaper = require('wallpaper'),
_=require('dotenv').config(),
  fs = require('fs'),
  moment = require('moment'),
  dayjs = require("dayjs"),
  nodeHtmlToImage = require('node-html-to-image'),
  service = require("os-service"),
  base64 = require("Base64"),
  WebUntis = require('webuntis'),
  render = async (m) => {
      m = m ?? moment()
      let lesson = await getNextLesson(),
        countToDelete = 31 - dayjs().daysInMonth(),
        startOffset = moment(m).startOf('month').format("d") - 1,
        monthName = m.format("MMMM"),
        html = `
<body>
    <style>
        body>div.time span:nth-of-type(2) {
            font-size: 57px !important;
            position: absolute;
            transform: translate(calc(calc(100vh / 3) * -1.3), -5px) rotate(-90deg);
            color: hsl(42deg 6% 45%) !important;
        }

        body>div>div>span:nth-of-type( ${Number(m.format("D")) + countToDelete}) {
            background: linear-gradient(180deg, rgb(196 74 74 / 1) var(--dayPercentage), rgb(196 74 74 / .4) var(--dayPercentage));

            --dayPercentage: calc( ${new Date().getHours() + new Date().getMinutes() / 60}/ 24 * 100%);
        }

        body>div.time {
            position: absolute;
            width: calc(1 / 1.61803*100vw);
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: space-evenly;
        }

        body>div.time span {
            font-size: calc(100vh / 3) !important;
            color: hsl(40deg 6% 45%);
        }

        body {
            width: 1920px;
            height: 1080px;
        }

        body>div>div span:nth-of-type(-n + ${countToDelete}) {
            display: none;
        }

        body>div>div span:nth-of-type( ${countToDelete + 1}) {
            counter-reset: day;
        }

        body>div:not(.time) {
            height: 100vh;
            position: absolute;
            right: 0;
            left: calc(1 / 1.61803*100vw);
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            grid-template-rows: repeat(8, 1fr);
            transform: scale(.8);
            transform-origin: left
        }
        #backgroundImage{
            background-image: url(${dataURI});
            background-size:cover;
            background-repeat:no-repeat;
            background-position:center;
            position: absolute;
            top:0;
            left:0;
            height:100%;
            width:100%;
            z-index:-2;
            transform:none;
          }

          #backgroundColor{
            background: rgb(16 22 34 /1);
            opacity:.8;
            position: absolute;
            top:0;
            left:0;
            height:100%;
            width:100%;
            z-index:-1;
            transform:none;
          }
        body {
            margin: 0;
            /* background-image:linear-gradient(0deg, rgb(16 22 34 /1), rgb(16 22 34 /1));*/
            background: rgb(16 22 34 /1);
            background-size:cover;


            overflow:hidden;
            background-repeat:no-repeat;
            background-position:center;
            counter-set: day -3
        }

        body>div>span:first-of-type {
            grid-row: 1/2;
            grid-column: 1/8;
            font-size: calc(100vh/7);
            text-align: center
        }

        body>div>div {
            grid-row: 3/9;
            grid-column: 1/8;
            display: grid;
            grid-template-rows: repeat(6, 1fr);
            grid-template-columns: repeat(7, 1fr);
            padding: 20px
        }

        body>div>div>* {
            counter-increment: day
        }

        body>div>div>div {
            grid-column: 1/calc(${startOffset} + 1)
        }

        body>div>div span::before {
            content: counter(day);
            font-size: calc(100vh / 20)
        }

        body>div>div span {
            display: flex;
            justify-content: center;
            align-items: center
        }

        body>div>span:not(:first-of-type) {
            font-size: calc(50vh / 20);
            display: flex;
            align-self: center;
            justify-self: center;
            color: hsl(0deg 51% 53%);
        }

        span {
            font-family: lovelo;
            color: #d9cfbd
        }

        body>.time>span:nth-of-type(3) {
            font-size: 1.5em !important;
            position: absolute;
            transform: translate(0px, calc(100vh / 3 / 2));
            left: 9vw;
            color: hsl(44deg 6% 45%);
        }

        b {
            opacity: 0.6;
        }

    </style>

    <div class="time"><span>${m.format("HH:mm")}</span>
        <span>${m.format("DD.MM.YYYY")}</span>
        <span style="whitespace:pre;">${(lesson.room != "") ? (lesson.room + " - " + (
          lesson.start ? (moment(lesson.start, "HHmm").isValid() ? moment(lesson.start, "HHmm").format("HH:mm") : moment(lesson.start, "Hmm").format("HH:mm")) : "") +
          " - " + lesson.title) : ""}</span>
    </div>

    <div>
        <span>${monthName}</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
        <div>
            <div></div>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>

        </div>
    </div>
    <div id="backgroundImage"></div>
    <div id="backgroundColor"></div>
</body>
`

      // console.log(html.split("\n").join("").split("\t").join("").split(" ").filter(e => e.length > 0).join(" "));
      return await nodeHtmlToImage({
        output: './bg_test.png',
        html,
      })
    },
    getNextLesson = async () => {
        try {
          const untis = new WebUntis('gymthun', 'tim.tschanz', base64.atob("THVtb3BpMTA="), 'thalia.webuntis.com');
          await untis.login();
          let timetableSrc = await untis.getOwnTimetableForToday();
          let timetableParsed = [];
          let currTime = new Date().getHours() * 100 + new Date().getMinutes();
          for (let i of timetableSrc) {
            timetableParsed.push({
              title: i.su[0].longname
                .replace("Ergänzungsfach", "")
                .replace("Schwerpunktfach", "")
                .replace("Grundlagenfach", ""),
              room: i.ro[0].name,
              start: i.startTime,
              end: i.endTime
            });
          }
          timetableParsed.sort((a, b) => {
            return a.start - b.start
          });
          let nextLesson;
          for (let i of timetableParsed) {
            if (i.start > currTime) {
              nextLesson = i;
              break;
            }
          }
          if (!nextLesson) throw "";
          return nextLesson;
        } catch {
          return {
            room: "",
            title: "",
          };
        }
      },
      dataURI = 'data:image/jpeg;base64,' + new Buffer.from(fs.readFileSync('./bgimg.jpg')).toString('base64'),
      update = async () => {
          wallpaper.set("./bg_test.png");
          console.log("updated");
        },
        updateAndWait = async () => {
            await render();
            update();
            console.log("updated");
            setTimeout(updateAndWait, 60000 - (new Date().getTime() - Math.floor(new Date().getTime() / 60000) * 60000))
          },

          updateRenderAndWait = () => {
            console.log("updating...");
            update();
            setTimeout(async () => {
              await render(moment().add(1, 'minutes'));
              console.log("render complete");
              let timeoutDur = 60000 - (new Date().getTime() - Math.floor(new Date().getTime() / 60000) * 60000);
              console.log("waiting until %s", moment().add(timeoutDur, "ms").format("HH:mm:ss:SSSS"));
              setTimeout(updateRenderAndWait, timeoutDur)
            }, 500);
          };

(async () => {
  await render(moment());
  updateRenderAndWait();
})()
