"use client";
import "./QueryForm.css";
import { useRef, useState } from "react";
import { getToken } from "@/helper/sessionHelper";
import myToast from "@/components/toast/toast";
import { createData } from "@/apiservices/orderapiservices";

const QueryForm = ({ item }) => {
  const isAdmin = getToken("token_travel");
  const dateref = useRef();
  const durationref = useRef();
  const groupsizeref = useRef();
  const experienceref = useRef();
  const furtherref = useRef();
  const moreRadio1ref = useRef();
  const moreRadio2ref = useRef();
  const moreRadio3ref = useRef();

  const FormattedDesc = () => {
    const moreRadio1 = moreRadio1ref.current.checked;
    const moreRadio2 = moreRadio2ref.current.checked;
    const moreRadio3 = moreRadio3ref.current.checked;

    const multipleAnswer = `
    ${moreRadio1 ? "Have Guiding: Yes" : "Have Guiding: No"},
    ${moreRadio2 ? "Have Accomodation: Yes" : "Have Accomodation: No"},
    ${moreRadio3 ? "Have Food: Yes" : "Have Food: No"}`;
    const text = `
    Available Date: ${dateref.current.value},
    Duration (days): ${durationref.current.value},
    Group Size: ${groupsizeref.current.value},
    Previous Experience: ${experienceref.current.value},
    Further Request: ${furtherref.current.value},
    ${multipleAnswer}
    `;

    return text;
  };
  const msgFailed = () => {
    myToast.warning("Instructors are not allowed to place order");
  };

  const [bookLoad, setBookLoad] = useState(false);

  //   const router = useRouter();

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const date = currentDate.getDate();
  const hour = currentDate.getHours();
  const minute = currentDate.getMinutes();
  const second = currentDate.getSeconds();
  const millisecond = currentDate.getMilliseconds();
  let uniqueNumber = `order-${year}${month}${date}${hour}${minute}${second}${millisecond}`;

  async function orderCreate() {
    let res = await createData(
      uniqueNumber,
      item.packageId,
      item.createdUser,
      FormattedDesc(),
      "unpaid",
      item.price,
      1,
      "active",
      isAdmin.data.userName
    );
    if (res) {
      if (res.status == "noToken") {
        myToast.danger("You need to login to place order");
      } else {
        setBookLoad(true);
        myToast.success("You Order has been delivered");
      }
    }
  }

  return (
    <div
      className="form-single-page"
      style={{ width: "80%", margin: "20px auto" }}
    >
      <div>
        <h1>Dates you’re available:</h1>
        <input ref={dateref} type="text"></input>
      </div>
      <div>
        <h1>How long do you want it for:</h1>
        <input ref={durationref} type="text"></input>
      </div>
      <div>
        <h1>Group Size:</h1>
        <input ref={groupsizeref} type="text"></input>
      </div>
      <div>
        <h1>Previous experience & fitness level:</h1>
        <input ref={experienceref} type="text"></input>
      </div>
      <div>
        <h1>Any further requests:</h1>
        <input ref={furtherref} type="text"></input>
      </div>

      <div className="checkbox-single-form">
        <h1>What you require:</h1>
        <div style={{ display: "flex" }}>
          <label for="box1">Guiding</label>
          <input ref={moreRadio1ref} id="box1" type="checkbox" />
        </div>

        <div style={{ display: "flex" }}>
          <label for="box2">Accommodation</label>
          <input ref={moreRadio2ref} id="box2" type="checkbox" />
        </div>
        <div style={{ display: "flex" }}>
          <label for="box3">Food</label>
          <input ref={moreRadio3ref} id="box3" type="checkbox" />
        </div>
      </div>
      <div
        style={{
          height: "80px",
          marginTop: "20px",
        }}
        className="d-grid gap-2 book-button"
      >
        {isAdmin.data ? (
          isAdmin.data.userRole == "instructor" ? (
            <button
              onClick={msgFailed}
              className="btn btn-secondary"
              type="button"
              style={{ fontSize: "20px" }}
            >
              Send request now
            </button>
          ) : (
            <button
              onClick={orderCreate}
              className="btn btn-secondary"
              type="button"
              style={{ fontSize: "20px" }}
            >
              {bookLoad ? "Request already sent" : "Send request now"}
            </button>
          )
        ) : (
          <button
            onClick={orderCreate}
            className="btn btn-secondary"
            type="button"
            style={{ fontSize: "20px" }}
          >
            {bookLoad ? "Request already sent" : "Send request now"}
          </button>
        )}
      </div>
    </div>
  );
};

export default QueryForm;
