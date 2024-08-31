import { css } from "lit";

export const styles = css`
:host {
      input {
        width: 10%;
        padding: 10px;
        margin: 5px 0;
        border-radius: 4px;
        box-sizing: border-box;
      }

      .disabled {
        background-color: #f1f1f1;
        color: #a0a0a0;
      }

      .invalid {
        border: 1px solid red;
        color: red;
      }

      .valid {
        border: 1px solid #ccc;
        color: black;
      }

      .control {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex-wrap: nowrap;
        align-items: stretch;
        align-content: flex-start;
        margin: 10px 0;

        .label {
          display: flex;
          flex-direction: row;
          color: #242424;
          font-size: 14px;
          font-weight: 600;
          flex-wrap: nowrap;
          justify-content: flex-start;
        }
        .label.error {
            color: red;
        }

        .message {
          display: flex;
          flex-direction: row;
          justify-content: space-between;

          .message-error {
              color: red;
              font-size: 12px;
              font-weight: 400;
          }
        }

      }
    }
`