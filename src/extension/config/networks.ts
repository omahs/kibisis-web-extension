import {
  AssetTypeEnum,
  NetworkTypeEnum,
  WalletConnectMethodEnum,
} from '@extension/enums';

// types
import { INetwork } from '@extension/types';

const algorandIconUri: string =
  'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPHBhdGgKCSAgICAgIGQ9Ik0gMy43OTI0ODAxLDExOTYuNzU0NyBDIDcuMzg4OTI2LDExOTAuNzg2OCAxNzIuNTQ4ODcsOTA0LjUzNjYzIDI2Mi43MTM5Miw3NDggMzM5LjQwNzIzLDYxNC44NTE4MyA0MDIuMzI1MzUsNTA1Ljg0MDM4IDY1MC4yODM0OCw3Ni41IDY3Mi44MzYxMywzNy40NSA2OTIuMTU0MDgsNC4yNjI1IDY5My4yMTIyNSwyLjc1IEwgNjk1LjEzNjE5LDAgaCA5MC4zMDAxMyA5MC4zMDAxMyBsIDEuNTgzMTksNS43NSBjIDAuODcwNzUsMy4xNjI1IDE0LjkwOTk2LDU1LjcgMzEuMTk4MjUsMTE2Ljc1IDMzLjM0NTM2LDEyNC45ODE0OCA0NC43MjU4NiwxNjcuMTc1MzkgNDYuNjYxNDMsMTczIGwgMS4zMjkyMyw0IDkzLjczNDE1LDAuNSA5My43MzQxLDAuNSAtNjMuNjM4OSwxMTAgYyAtMzUuMDAxNCw2MC41IC02My44MjA2LDExMC45IC02NC4wNDI2LDExMiAtMC4yMjIsMS4xIDMuODc3NiwxNy41MzgxNCA5LjExMDIsMzYuNTI5MjEgQyAxMDQyLjUwNDksNjIxLjA4OTQzIDExOTcsMTE5Ny4yNzQ4IDExOTcsMTE5OC45ODY0IGMgMCwwLjY3NzUgLTMwLjc1OTIsMS4wMTM2IC05Mi43NjgzLDEuMDEzNiBoIC05Mi43Njg0IEwgOTc0LjA4NDA4LDEwNjAuMjUgQyA5NDMuMjg5Niw5NDUuMTE4NTQgODkxLjY2MjM3LDc1My45ODQ5OSA4ODkuMzc0MjMsNzQ2LjYzODQ5IGMgLTAuNDg0ODIsLTEuNTU2NTkgLTAuNzg3MDYsLTEuNjM4NDkgLTEuODQ1MiwtMC41IC0wLjY5NTk3LDAuNzQ4ODMgLTMzLjIyMzg2LDU2LjcxMTUxIC03Mi4yODQxOSwxMjQuMzYxNTEgLTM5LjA2MDMzLDY3LjY1IC05Ny42NTA3MSwxNjkuMTI1IC0xMzAuMjAwODUsMjI1LjUgLTMyLjU1MDE0LDU2LjM3NSAtNTkuNTEzMTIsMTAyLjgzOTYgLTU5LjkxNzczLDEwMy4yNTQ3IC0wLjQwNDYxLDAuNDE1MSAtNDcuMTUzMTUsMC42NDAxIC0xMDMuODg1NjUsMC41IEwgNDE4LjA5MDYzLDExOTkuNSA1MDcuMzYxNjUsMTA0NCBDIDU1Ni40NjA3MSw5NTguNDc1IDYzNi45MjIzNCw4MTguOTc1IDY4Ni4xNjUyNiw3MzQgNzc2LjYwMjU3LDU3Ny45Mzg4MSA4MTkuNzMxNzcsNTAzLjM0MDc3IDgyMS44NjcwOCw0OTkuMjg0NTkgYyAwLjk5MDY2LC0xLjg4MTgzIC0zLjUxMjA1LC0xOS43MjUwMiAtMjkuOTAzMzIsLTExOC41IEMgNzU0Ljg4MDcxLDI0MS45OTMyOSA3NTcuODg0MjUsMjUzIDc1Ny4wOTM1MiwyNTMgNzU1Ljc5NTAzLDI1MyA3MjMuMjI4NTcsMzA4Ljg3MTg4IDY0MS45NzUyLDQ1MC41IDU5Ni4yMjE4OCw1MzAuMjUgNTE3LjQ1ODcsNjY2LjgyNSA0NjYuOTQ1OSw3NTQgNDE2LjQzMzEsODQxLjE3NSAzMzcuODE3ODksOTc3LjA3NSAyOTIuMjQ1NDMsMTA1NiBsIC04Mi44NTkwMSwxNDMuNSAtMTAzLjc3NzY1LDAuMjU0NyAtMTAzLjc3NzY1MDcsMC4yNTQ2IHoiIC8+Cjwvc3ZnPgo=';
const algorandListingUri: string =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAxnpUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHjabVBBDsQgCLz7in2CAlV8jt3aZH+wz99RaNM2O4kDMmZAQv9+9vAaoCRBlqK55hwBqVKpIdFoaJNTlMkT4hLut3o4BUKJEdmumv39UU+ngYWGbLkY6duF9S5U70D6MPJGPCYiJJsbVTdiMiG5QbNvxVy1XL+w9niH2gmD9mMnxcLzLgXb2xb0YaLOiSOYOdsAPA4HbhAIHLngYeIyKwoWJp8EC/m3pwPhBxlBWYcVT7MZAAABhGlDQ1BJQ0MgcHJvZmlsZQAAeJx9kT1Iw0AcxV9TpSIVUQuKOGSoThZERRy1CkWoEGqFVh1MLv0QmjQkKS6OgmvBwY/FqoOLs64OroIg+AHi6uKk6CIl/i8ptIjx4Lgf7+497t4BQq3ENKttDNB020wl4mImuyKGXhFGCD3oRb/MLGNWkpLwHV/3CPD1Lsaz/M/9ObrUnMWAgEg8wwzTJl4nntq0Dc77xBFWlFXic+JRky5I/Mh1xeM3zgWXBZ4ZMdOpOeIIsVhoYaWFWdHUiCeJo6qmU76Q8VjlvMVZK1VY4578heGcvrzEdZpDSGABi5AgQkEFGyjBRoxWnRQLKdqP+/gHXb9ELoVcG2DkmEcZGmTXD/4Hv7u18hPjXlI4DrS/OM7HMBDaBepVx/k+dpz6CRB8Bq70pr9cA6Y/Sa82tegR0L0NXFw3NWUPuNwBBp4M2ZRdKUhTyOeB9zP6pizQdwt0rnq9NfZx+gCkqavkDXBwCIwUKHvN590drb39e6bR3w8yP3KNgU0c7AAADltpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDQuNC4wLUV4aXYyIj4KIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgIHhtbG5zOkdJTVA9Imh0dHA6Ly93d3cuZ2ltcC5vcmcveG1wLyIKICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICB4bXBNTTpEb2N1bWVudElEPSJnaW1wOmRvY2lkOmdpbXA6ODMzMTg2MDItNGViMS00NzYwLWJjZmUtZGUwMGY5NWYyY2RmIgogICB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjdmNzYzMDA0LTgwYzMtNDZiNS05NzE2LWFmNjU4ZjE0MzMyMSIKICAgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjc2NGYzMzM5LWZiNzQtNGY4NS05MDNkLWZlODc2ZTkwZjVjNSIKICAgZGM6Rm9ybWF0PSJpbWFnZS9wbmciCiAgIEdJTVA6QVBJPSIyLjAiCiAgIEdJTVA6UGxhdGZvcm09IkxpbnV4IgogICBHSU1QOlRpbWVTdGFtcD0iMTcwMTk2OTUyMzQ0NTUyMyIKICAgR0lNUDpWZXJzaW9uPSIyLjEwLjM2IgogICB0aWZmOk9yaWVudGF0aW9uPSIxIgogICB4bXA6Q3JlYXRvclRvb2w9IkdJTVAgMi4xMCIKICAgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMzoxMjowN1QxNzoxODo0MiswMDowMCIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjM6MTI6MDdUMTc6MTg6NDIrMDA6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJzYXZlZCIKICAgICAgc3RFdnQ6Y2hhbmdlZD0iLyIKICAgICAgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo0MWNhMDhjMC1hYmYwLTRlYjItYjY4OS05N2JmODUwZjRhMmYiCiAgICAgIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkdpbXAgMi4xMCAoTGludXgpIgogICAgICBzdEV2dDp3aGVuPSIyMDIzLTEyLTA3VDE3OjExOjI3KzAwOjAwIi8+CiAgICAgPHJkZjpsaQogICAgICBzdEV2dDphY3Rpb249InNhdmVkIgogICAgICBzdEV2dDpjaGFuZ2VkPSIvIgogICAgICBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmU1YWE1NTJhLTFkOWUtNDE5Ny1hMzQxLTA0ODliMTc2ZmVhNSIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iR2ltcCAyLjEwIChMaW51eCkiCiAgICAgIHN0RXZ0OndoZW49IjIwMjMtMTItMDdUMTc6MTg6NDMrMDA6MDAiLz4KICAgIDwvcmRmOlNlcT4KICAgPC94bXBNTTpIaXN0b3J5PgogIDwvcmRmOkRlc2NyaXB0aW9uPgogPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+W5rQBgAAAAZiS0dEAG8AKgDimf8bgQAAAAlwSFlzAAAN1wAADdcBQiibeAAAAAd0SU1FB+cMBxESK1YeFPYAAAfjSURBVHja3VttTFTZGX7uMMMOgvMhoDM267IxqTW2EcHQak3sR1I1cVOdH9hq69YmLiIGx8RINGkss9b6pzbEGE2jtt00BLUhBaQ1NfJD1InF1brLLrNMlwDZTOw44DAzMMA9H/3RK5m59zI6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';
const voiIconUri: string =
  'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTIwMCAxMjAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPHBhdGggZD0ibSA1MzYuNjE1MDcsMTE0MS4xMzUzIGMgLTM3LjIxNzU0LC0xMC41OTQ5IC02OS4zODk1LC0yOS4zOTggLTEwMC44MTkzOCwtNTguOTI0OCAtMjEuNDc1OTMsLTIwLjE3NTQgLTMzLjkyMDQ1LC0zNy43NDA2IC02MS4yMDAwMiwtODYuMzgyNzUgLTIuOTI4NDMsLTUuMjIxNjYgLTI1Ljc5ODgsLTQ0Ljc0MDA4IC01MC44MjMwNiwtODcuODE4NzEgQyAyOTguNzQ4MzYsODY0LjkzMDQxIDI2MS41MjI1Nyw4MDAuODQ2NDkgMjQxLjA0ODY0LDc2NS42MDAzNCAyMjAuNTc0NzEsNzMwLjM1NDE4IDE3NS44NTY3NCw2NTMuNDUzNDkgMTQxLjY3NTM4LDU5NC43MDk5IC00Ljc5MDM3MjgsMzQyLjk5NTk4IC0zLjM3OTcyNzEsMzQ2LjI1NDg0IDEuNDQ1MzQ4NywyNzAuNzUxNTkgMTIuNDk4ODA1LDk3Ljc4NjAyMSAxOTAuNDIwMTgsLTAuMDA1OTQyMTggMzQ4LjgzMjEzLDc5LjgxNTM2MyBjIDQzLjI3MzA4LDIxLjgwNDYyNyA3My43MTAyNiw1Ny44NzI3NjcgMTI4LjM5NDA2LDE1Mi4xNDczMDcgMjcuMTMzMjgsNDYuNzc3NjMgNjMuMDQ1MDksMTA4LjU0NzY4IDc5LjgwNCwxMzcuMjY2NzcgMTYuNzU4OTUsMjguNzE5MDkgMzIuMTczNjEsNTUuMjkzNTkgMzQuMjU0NzUsNTkuMDU0NDIgNy43NzgwMSwxNC4wNTU0OSAxMy44NDExOCw4LjkxNjI1IDM3LjM1NTQyLC0zMS42NjMwNSBDIDc4NC4yNTIzLDEyOC4wNzU5NSA3NzUuMTEyOTQsMTQyLjY2NTY0IDgwNC45ODE2NCwxMTUuMTE1OTIgOTU4LjIzOTYsLTI2LjI0MzEwNCAxMTk5Ljk1NTEsNzguNDMwODc5IDExOTkuOTU1MSwyODYuMTU3NjkgYyAwLDYxLjQ4NzAzIC02LjQxOCw3OS42NTIwMyAtNjEuMjE3MywxNzMuMjYzOTQgLTIxLjM5NjcsMzYuNTUxNTQgLTU2Ljg0MzYsOTcuNDMxMjYgLTc4Ljc3MDUsMTM1LjI4ODI3IC0yMS45MjcsMzcuODU2OTYgLTQ5Ljk0NzUsODUuOTE5OSAtNjIuMjY3NzcsMTA2LjgwNjUyIC0xMi4zMjAzMiwyMC44ODY1OSAtNTMuMTQxNTUsOTEuMzc4ODkgLTkwLjcxMzgzLDE1Ni42NDk1NyAtMTIxLjkzNDExLDIxMS44MjQyMSAtMTI3LjQyODM2LDIxOS43OTc0MSAtMTcyLjk0MDA2LDI1MC45NjU5MSAtNTUuOTg4ODUsMzguMzQzOCAtMTMxLjkyMDYzLDUwLjY1MjMgLTE5Ny40MzA1NywzMi4wMDM0IHoiIC8+Cjwvc3ZnPgo=';
const voiListingUri: string =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAxXpUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHjabVBBEsMgCLzzij5BwCg8xzTpTH/Q53dVkkk63RlXYHVFaP+8X/ToEM6Ul2rFS0lA9uzSEFiaaIM55cEDOSTktzqdgqCk2HWmVuL8UefTYG4N0XIxsmcI613weEHsxyge0t6RINjCyMNIZQocBm1+KxW3ev3Cuqc7bC7qpHV4nya/ea6Y3ragqCK7siawapkNaF9K2iAIGNdxkLWOig/m6AQD+TenA/QF5AZZHCIdZIIAAAGEaUNDUElDQyBwcm9maWxlAAB4nH2RPUjDQBzFX1OlIhVRO4g4ZKhOFkSLOGoVilAh1AqtOphc+iE0aUhSXBwF14KDH4tVBxdnXR1cBUHwA8TVxUnRRUr8X1JoEePBcT/e3XvcvQOEeplpVsc4oOm2mU4mxGxuRQy9IowQ+tCPuMwsY1aSUvAdX/cI8PUuxrP8z/05etS8xYCASDzDDNMmXiee2rQNzvvEEVaSVeJz4jGTLkj8yHXF4zfORZcFnhkxM+k54gixWGxjpY1ZydSI48RRVdMpX8h6rHLe4qyVq6x5T/7CcF5fXuI6zWEksYBFSBChoIoNlGEjRqtOioU07Sd8/EOuXyKXQq4NMHLMowINsusH/4Pf3VqFyQkvKZwAOl8c52MECO0CjZrjfB87TuMECD4DV3rLX6kD05+k11pa9Ajo3QYurluasgdc7gCDT4Zsyq4UpCkUCsD7GX1TDhi4BbpXvd6a+zh9ADLUVeoGODgERouUvebz7q723v490+zvB3pocqqkgdnbAAAPPmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNC40LjAtRXhpdjIiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6R0lNUD0iaHR0cDovL3d3dy5naW1wLm9yZy94bXAvIgogICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgIHhtcE1NOkRvY3VtZW50SUQ9ImdpbXA6ZG9jaWQ6Z2ltcDo5ZDhkNTMwNi05MjMxLTQ4YmYtYjI2ZS1hMzZlZWQyODEyYTkiCiAgIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OGZmMWY2MjUtOGNmZC00ODNhLTg0NTQtYTg4YmI0NThlMWZjIgogICB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZGMzZDg3YTMtN2QzMC00OWZlLWFiNTMtZTdkOGEzMTY4ZmRiIgogICBkYzpGb3JtYXQ9ImltYWdlL3BuZyIKICAgR0lNUDpBUEk9IjIuMCIKICAgR0lNUDpQbGF0Zm9ybT0iTGludXgiCiAgIEdJTVA6VGltZVN0YW1wPSIxNzAxOTY5NTUyNzgxMDExIgogICBHSU1QOlZlcnNpb249IjIuMTAuMzYiCiAgIHRpZmY6T3JpZW50YXRpb249IjEiCiAgIHhtcDpDcmVhdG9yVG9vbD0iR0lNUCAyLjEwIgogICB4bXA6TWV0YWRhdGFEYXRlPSIyMDIzOjEyOjA3VDE3OjE5OjExKzAwOjAwIgogICB4bXA6TW9kaWZ5RGF0ZT0iMjAyMzoxMjowN1QxNzoxOToxMSswMDowMCI+CiAgIDx4bXBNTTpIaXN0b3J5PgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaQogICAgICBzdEV2dDphY3Rpb249InNhdmVkIgogICAgICBzdEV2dDpjaGFuZ2VkPSIvIgogICAgICBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjAxMzM0YThmLWVjNzgtNDE0NC1hNjRlLTFhZDI3NWM2NWFhMiIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iR2ltcCAyLjEwIChMaW51eCkiCiAgICAgIHN0RXZ0OndoZW49IjIwMjMtMTItMDdUMTc6MDY6MDQrMDA6MDAiLz4KICAgICA8cmRmOmxpCiAgICAgIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiCiAgICAgIHN0RXZ0OmNoYW5nZWQ9Ii8iCiAgICAgIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NjYwYmFjODYtMWU1YS00M2MxLTkyN2QtYTVjNTUxMjVhOWM4IgogICAgICBzdEV2dDpzb2Z0d2FyZUFnZW50PSJHaW1wIDIuMTAgKExpbnV4KSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyMy0xMi0wN1QxNzoxMjowNCswMDowMCIvPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJzYXZlZCIKICAgICAgc3RFdnQ6Y2hhbmdlZD0iLyIKICAgICAgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiNmYyOWM0NS05MDNiLTRjNmUtODg1NS01YzE1YWIyODlkZTEiCiAgICAgIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkdpbXAgMi4xMCAoTGludXgpIgogICAgICBzdEV2dDp3aGVuPSIyMDIzLTEyLTA3VDE3OjE5OjEyKzAwOjAwIi8+CiAgICA8L3JkZjpTZXE+CiAgIDwveG1wTU06SGlzdG9yeT4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/Psr3E3MAAAAGYktHRABvACoA4pn/G4EAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnDAcREwzqD5DcAAAHHElEQVR42uWbf2xT1xXHP+/aDrEDJFnKb+GyarCSMuikCVjpH+kqTRGVyh+UTcqklrYg0aHWWqdKlbZpmjRpWqUlc9kYU2CjWce0dUxqgDZsZcpW0IC0hZbWWZMpahNKFUOIf8Rx7Ge/tz/eTQrESXyf30sT8v0zee/4fM8799xzzzlXw0WEansFsBLYCNwLrAVWAUuAKsAvH00DMaAf+AjoBC4C54G+cCRouKWj5gJpL7AJ2A7UA6sBr01xOaAbaAOOAufCkWBuRhogVNt7B7AT2AWsccG4JtAFHAQOhyPBazPCAJL4s8AeoJrpwSBwAGgs1RBaCcR9wG7gx8BiPh9EgZ8AzeFIUJ82A4Rqe9cCzcAWZgbOALvDkWCnqwYI1fZqwGNAGFjIzEICCAEvhSNBs9iXhAL5MqAJODQDySN1OgQ0SV2d84BQbW8AaJFb22zAUeDRcCQ4XLIBJPlXgK3MLrwG7JjKCKIIt2+ZheSROrdMtRzEFAHvhVnk9oWwHXhBclH2gMeAp5n9eFpyKT4GyH3+7AyN9na3yM2F8gQxQYbXfBuRH90imyW3m1DolLZbNcPTPLD6IR8b6vzULPUhBMSv5+m+MMKFP2fQE6YtrTUv3P1wGRvq/NyxbFRujq53Mrx1ZAQ9riR3i+S2f8IlIA82H6jk9ou/5uHbz1dz15f9aAUiyvWrOidaBnn7dxkl8mNy7/ajFVioA1GdV5sHee+IktwocM+NByjPjf/dvOh7P5Rn+KKwfIuHp36xmGUr5xVUEsBf4eGejQGSWpbLbxV3lL/zG172/HxyuYEKD1/5uppcoALIn7vadGpcDJBff0+xkjx++M4PaqisnrrW4fVqbHuihhX3T/1sWbVGw/M1LCxGrk9j25M1LN3sUfGCPZLruCC4U+U8v+kJPyvunFf0r5YHBI88W4XwTf5c/XPzWbKirHi5fkH9LqV4XS25fmYAWcbapSJlw/0B5aC2ao2fLU/5J133931TffNZvc6Pd77SK7sk5zEP2CTLWMUdIX2waKlPPapr8OCOKvzLtYIp2bZnKin3C2W5gQoPi9YpLYM1kvOYAbar1AY0H5SVqysKUPUFLw99f8G4v697pIy1Xw3YkokG5Qs1xTesFF/I0nW9ytumAfmcvb0dYGPdApbf57kpoG59vAoh7JcoM0PK+tSHanvFaN1+tcqbxgj09WRsK1tWLnh4b+VY3lD3TIDlwXm25aUSeaKX8sqhA1gpsJoWynX7N/+WxDDse8Ga9RWsb5jH/C8K6rZVlpTnXjqfIpdUfs0LbBRYHRtldB3T6bqUtq20ELD10Sq+9aNKFlR67X/9oTxtv0naff1egdWuUoZpwPEDcfSsfS9YsqKM9Zvml/T1T7+WIP6h7c7ZWoHVq7OFy//O8c7pJJ8Xoley/KNpqBQRqwRWo9I2jjclScbz007eNOD1P8TIJUoSs0RgdWltI9lj0N4an3YDdL0/zMU/ZkoVUyX4rEVtG+0vpvi0NzNt5LMZg1d/FcMs3fH8wgmF8sNw4nCspG1RBR3tSa6ccWbZCazhhJLx/itZOi8Mu04+PpjjRKNjgTctsCYzSocBrfviZNKuDXNgmnDqrzGGLzvmaTGBNZbiCPo78pw9lXDNAH09I5zen3ZSZL/AmslxDK83DnH9qu44+XzO5PjBGEbWUbEfCayBJMcw0m/yxl/imA7Hw0sdKbqOOW7YToE1jeUo/tOc5uNu51w1nTI49mLcmhJyFhcF1iiao5NXpg6tv42T053R+MzJOAPvOR5cc8B5AfRhjaI5ip6TOu+eHSpZzkC/zt8bU27E1G6gT8ghxDbn9yxobUqQStpPWEwTTv4pRnbQlQSrLRwJGqOZ4FFcWGHxDw3ePGH/nNDz3zQdvx9xJaWQnMeKouewhhAdxxu/TNH/ifrepWdNWvfHMHNuaEWX5GwZQI6fHnTjl3JJaHs5hqEYwzraE3z8T3fYAwdHR25vPAwdxprAdH6veTnDu2eLz9+jV7K0/sy1Qsug5MpNBpAd0wNuFS+OPBfng7dTUyZIg9d0Wn46wEjUtZPlgRu7w7cehxuxWsiOQ4+ZHHryOsdbBhi8po8zRHrYoKM9QePjUS7/yzXXj0qOYxjXiQjV9n4X+LWbR1pPAO560MeyL/nweODaJzn+166T/tT1esLecCR404BEoXp0M9CAi3PA+WHoPqbTjc404ozkxqQeIL1g7g5JyYDYiTV4bNwG5A0gNNEk+WQ1wZeAfbeBAfZJLgUxaTtWjpkeYfZOix4FGsKRYNaWAaQR5u6wtIwHw8CO0cPDLPryO4oZly+qLyAFNWDdFJnJgdGQOjYUQ76oJXDLcrjtrszM+UtTtlpj8oceAPa6dXZQyO33Ag/YIW/bA27xhrl5cXICQ+xkrl2dLWCIuXl5egJjzPjr8/8HYKadv86Sx1sAAAAASUVORK5CYII=';

const networks: INetwork[] = [
  /**
   * voi networks
   */
  {
    algods: [
      {
        canonicalName: 'AlgoNode',
        port: '',
        url: 'https://testnet-api.voi.nodly.io',
      },
    ],
    canonicalName: 'Voi',
    chakraTheme: 'voi',
    explorers: [
      {
        accountPath: '/account',
        applicationPath: '/application',
        assetPath: '/asset',
        baseUrl: 'https://voi.observer/explorer',
        blockPath: '/block',
        canonicalName: 'Voi Observer',
        groupPath: '/group',
        id: 'voi-observer',
        transactionPath: '/transaction',
      },
    ],
    feeSunkAddress:
      'FEES3ZW52HQ7U7LB3OGLUFQX2DCCWPJ2LIMXAH75KYROBZBQRN3Q5OR3GI',
    genesisId: 'voitest-v1',
    genesisHash: 'IXnoWtviVVJW5LGivNFc0Dq14V3kqaXuK2u5OQrdVZo=',
    indexers: [
      {
        canonicalName: 'AlgoNode',
        port: '',
        url: 'https://testnet-idx.voi.nodly.io',
      },
    ],
    namespace: {
      key: 'voi',
      methods: [
        WalletConnectMethodEnum.SignTxns,
        WalletConnectMethodEnum.SignBytes,
      ],
      reference: 'IXnoWtviVVJW5LGivNFc0Dq14V3kqaXu',
    },
    nativeCurrency: {
      decimals: 6,
      iconUrl: voiIconUri,
      listingUri: voiListingUri,
      symbol: 'VOI',
      type: AssetTypeEnum.Native,
      verified: true,
    },
    type: NetworkTypeEnum.Test,
  },
  /**
   * algorand networks
   */
  {
    algods: [
      {
        canonicalName: 'AlgoNode',
        port: '',
        url: 'https://mainnet-api.algonode.cloud',
      },
    ],
    canonicalName: 'Algorand',
    chakraTheme: 'algorand',
    explorers: [
      {
        accountPath: '/address',
        applicationPath: '/application',
        assetPath: '/asset',
        baseUrl: 'https://explorer.perawallet.app',
        blockPath: '/block',
        canonicalName: 'Pera Explorer',
        groupPath: '/tx-group',
        id: 'pera',
        transactionPath: '/tx',
      },
      {
        accountPath: '/account',
        applicationPath: '/application',
        assetPath: '/asset',
        baseUrl: 'https://allo.info',
        blockPath: '/block',
        canonicalName: 'Allo',
        groupPath: '/tx/group',
        id: 'allo',
        transactionPath: '/tx',
      },
    ],
    feeSunkAddress:
      'Y76M3MSY6DKBRHBL7C3NNDXGS5IIMQVQVUAB6MP4XEMMGVF2QWNPL226CA',
    genesisId: 'mainnet-v1.0',
    genesisHash: 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=',
    indexers: [
      {
        canonicalName: 'AlgoNode',
        port: '',
        url: 'https://mainnet-idx.algonode.cloud',
      },
    ],
    namespace: {
      key: 'algorand',
      methods: [
        WalletConnectMethodEnum.SignTxns,
        WalletConnectMethodEnum.SignBytes,
      ],
      reference: 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73k',
    },
    nativeCurrency: {
      decimals: 6,
      iconUrl: algorandIconUri,
      listingUri: algorandListingUri,
      symbol: 'ALGO',
      type: AssetTypeEnum.Native,
      verified: true,
    },
    type: NetworkTypeEnum.Stable,
  },
  {
    algods: [
      {
        canonicalName: 'AlgoNode',
        port: '',
        url: 'https://betanet-api.algonode.cloud',
      },
    ],
    canonicalName: 'Algorand',
    chakraTheme: 'algorand',
    explorers: [],
    feeSunkAddress:
      'A7NMWS3NT3IUDMLVO26ULGXGIIOUQ3ND2TXSER6EBGRZNOBOUIQXHIBGDE',
    genesisId: 'betanet-v1.0',
    genesisHash: 'mFgazF+2uRS1tMiL9dsj01hJGySEmPN28B/TjjvpVW0=',
    indexers: [
      {
        canonicalName: 'AlgoNode',
        port: '',
        url: 'https://betanet-idx.algonode.cloud',
      },
    ],
    namespace: {
      key: 'algorand',
      methods: [
        WalletConnectMethodEnum.SignTxns,
        WalletConnectMethodEnum.SignBytes,
      ],
      reference: 'mFgazF-2uRS1tMiL9dsj01hJGySEmPN2',
    },
    nativeCurrency: {
      decimals: 6,
      iconUrl: algorandIconUri,
      listingUri: algorandListingUri,
      symbol: 'ALGO',
      type: AssetTypeEnum.Native,
      verified: true,
    },
    type: NetworkTypeEnum.Beta,
  },
  {
    algods: [
      {
        canonicalName: 'AlgoNode',
        port: '',
        url: 'https://testnet-api.algonode.cloud',
      },
    ],
    canonicalName: 'Algorand',
    chakraTheme: 'algorand',
    explorers: [
      {
        accountPath: '/address',
        applicationPath: '/application',
        assetPath: '/asset',
        baseUrl: 'https://testnet.explorer.perawallet.app',
        blockPath: '/block',
        canonicalName: 'Pera Explorer',
        groupPath: '/tx-group',
        id: 'pera',
        transactionPath: '/tx',
      },
    ],
    feeSunkAddress:
      'A7NMWS3NT3IUDMLVO26ULGXGIIOUQ3ND2TXSER6EBGRZNOBOUIQXHIBGDE',
    genesisId: 'testnet-v1.0',
    genesisHash: 'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
    indexers: [
      {
        canonicalName: 'AlgoNode',
        port: '',
        url: 'https://testnet-idx.algonode.cloud',
      },
    ],
    namespace: {
      key: 'algorand',
      methods: [
        WalletConnectMethodEnum.SignTxns,
        WalletConnectMethodEnum.SignBytes,
      ],
      reference: 'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDe',
    },
    nativeCurrency: {
      decimals: 6,
      iconUrl: algorandIconUri,
      listingUri: algorandListingUri,
      symbol: 'ALGO',
      type: AssetTypeEnum.Native,
      verified: true,
    },
    type: NetworkTypeEnum.Test,
  },
];

export default networks;
