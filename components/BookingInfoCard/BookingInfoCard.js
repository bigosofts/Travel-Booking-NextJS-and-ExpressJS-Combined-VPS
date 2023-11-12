"use client";
import "./BookingInfoCard.css";
import QueryForm from "../QueryForm/QueryForm";

function BookingInfoCard({ filler }) {
  var isoTime = filler.travelTime;

  var date = new Date(isoTime);

  var options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  var formattedDate = date.toLocaleDateString("en-US", options);

  return (
    <>
      <div className="sidebar-special">
        <div className="style-1">
          <div className="style-2">
            <div className="style-3">
              <span className="style-4">Price: ${filler.price}</span>
            </div>
          </div>
        </div>
        <div className="style-5">
          <img src="/images/next1.png" className="style-6" />
          <div className="style-7">
            <div className="style-8">Travel Date: {formattedDate}</div>
            <div className="style-9">Duration: {filler.duration} days</div>
          </div>
        </div>
      </div>
      <QueryForm item={filler} />
    </>
  );
}

export default BookingInfoCard;
