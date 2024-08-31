import { css } from "lit";

export const styles = css`
  :host {
    button {
      padding: 10px 20px;
      margin: 8px 0;
      border: none;
      border-radius: 15px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
    }

    button:disabled{
      background-color: #ccc;
      color: #fff;
      cursor: not-allowed;
    }

    p {
      margin: 0;
      padding: 0;
    }

    h3 {
      margin: 0;
      padding: 0;
    }

    ul {
      margin: 0;
      padding: 0 12px;
      margin-block-start: 0;
      margin-block-end: 0;
      margin-inline-start: 0px;
      margin-inline-end: 0px;
      padding-inline-start: 0;
    }
  }

  .grow { 
    transition: all .2s ease-in-out; 
  }

  .grow:hover { 
    transform: scale(1.02); 
  }


  .clients {
    display: flex;
    align-items: stretch;
    padding: 20px 50px;
    border: 1px solid #ccc;
    border-radius: 15px;
    width: 400px;
    background-color: #ffffff;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: center;
  }

  .clients-list {
    display: flex;
    margin: 2rem;
    flex-flow: column;
    gap: 1rem;
    align-items: stretch;
    list-style: none;
    width: 100%;
    place-content: stretch center;
    max-height: 400px;
    overflow-y: scroll;
    overflow-x: hidden;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: flex-start;

    li {
      display: flex;
      flex-direction: column;
      border: 1px solid rgb(204, 204, 204);
      border-radius: 15px;
      flex-wrap: nowrap;
      align-content: center;
      align-items: center;
      justify-content: center;
      padding: 15px;
      margin: 5px;

      .one {
        display: flex;
        flex-flow: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }

      .remove {
        background-color: #f12222;
        color: white;
      }
    }
  }

  .actions {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 1rem;

  }

  .send {
    background-color: #4CAF50;
    color: white;
  }

  .change {
    background-color: #0797f7;
    color: white;
  }

  .card-client {
    display: flex;
    flex-direction: column;
    padding-bottom: 25px;

    h2 {
      text-align: center;
      font-size: 20px;
      font-weight: 500;
    }

    .card {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      align-items: flex-start;
      padding: 15px;
      border: 1px solid #ccc;
      border-radius: 15px;
      align-content: flex-start;
      margin: 15px;
    }
  }

  .scrollbar {
    margin-left: 30px;
    float: left;
    overflow-y: scroll;
    margin-bottom: 25px;
  }

  .scrollbar::-webkit-scrollbar-track
  {
    border: 1px solid #545759;
    background-color: #F5F5F5;
    border-radius: 15px;
  }

  .scrollbar::-webkit-scrollbar
  {
    width: 8px;
    background-color: #F5F5F5;
  }

  .scrollbar::-webkit-scrollbar-thumb
  {
    background-color: #545759;
    border-radius: 15px;
  }
` 