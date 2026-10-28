# Owed post-session survey

The questionnaire participants fill in after an Owed test session. It's a single static page (`index.html`) served by GitHub Pages. Each response is sent to a Google Sheet that only you can open.

## Connect the Google Sheet (one time, about 3 minutes)

1. Create a new Google Sheet, for example "Owed survey responses".
2. In the sheet, open **Extensions → Apps Script**.
3. Delete what's in `Code.gs`, paste in [`apps-script/Code.gs`](apps-script/Code.gs), and save.
4. Click **Deploy → New deployment**. Choose the type **Web app** and set:
   - **Execute as:** Me
   - **Who has access:** Anyone
5. Click **Deploy** and authorize. Google warns that the app isn't verified because you wrote it yourself. Choose **Advanced → Go to (project name)** to continue.
6. Copy the **Web app URL** (it ends in `/exec`).
7. In `index.html`, set `var ENDPOINT = '...';` to that URL, then commit and push.

To check the connection, open the web app URL in a browser. It should show `{"ok":true,"service":"owed-post-survey"}`.

Until `ENDPOINT` is set, the survey still works, but at the end participants copy their answers instead of sending them.

## How responses arrive

- Each participant gets one row in the **Responses** tab, keyed by `Response ID`.
- Their row is saved after each of the three parts, so you keep partial answers even if someone stops early. `Complete` changes to `yes` when they submit.
- The web app URL only accepts new answers. It can't read the sheet, so the sheet stays private.
- Answers in progress are also kept in the browser, so a reload doesn't lose them.

## Running a session

Open the survey on the phone or laptop you hand to the participant, type their ID (P1, P2…), and tap **Start survey**. After they submit, tap **Start next participant** to clear the device.
