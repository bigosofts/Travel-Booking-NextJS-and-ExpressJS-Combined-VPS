"use client";
import { useEffect, useState } from "react";
import "./CardOffer.css";
import { selectData } from "@/apiservices/travelpackageapiservices.js";
import { updateData } from "@/apiservices/messageapiservices";
import { createData } from "@/apiservices/orderapiservices";
import mytoast from "../toast/toast";
import { useSelector } from "react-redux";

const OfferCard = ({ msgData, id, socket }) => {
  const [packageData, setPackageData] = useState();
  const isAdmin = useSelector((state) => state.isAdmin.value);

  function generateUniqueNumber() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const date = currentDate.getDate();
    const hour = currentDate.getHours();
    const minute = currentDate.getMinutes();
    const second = currentDate.getSeconds();
    const millisecond = currentDate.getMilliseconds();

    let uniqueNumber = `order-${year}${month}${date}${hour}${minute}${second}${millisecond}`;
    return uniqueNumber;
  }

  const updateMessage = async (totalPrice, accept, reject) => {
    if (isAdmin.data.userRole == "instructor") {
      mytoast.danger("Only client can accept or reject");
    } else {
      if (msgData.acceptedPackage == true) {
        mytoast.warning("Order already created");
      } else {
        if (accept == true) {
          //payment gatway here
          let aboutData = {
            _id: msgData._id,
            text: msgData.text,
            attachment: msgData.attachment,
            sender: msgData.sender,
            senderRole: msgData.senderRole,
            receiver: msgData.receiver,
            receiverRole: msgData.receiverRole,
            conversationID: msgData.conversationID,
            sendedpackageID: msgData.sendedpackageID,
            acceptedPackage: accept,
            rejectedPackage: false,
            quantityPackage: msgData.quantityPackage,
            addedPrice: msgData.addedPrice,
          };

          const res = await updateData(aboutData);
          if (res.status == "Success") {
            let uniqueNumber = generateUniqueNumber();
            let res3 = await createData(
              uniqueNumber,
              msgData.sendedpackageID,
              msgData.sender,
              "New Order",
              "unpaid",
              totalPrice,
              msgData.quantityPackage,
              "active",
              isAdmin.data.userName
            );
            if (res3.status == "Success") {
              socket.emit("msg", res3.data);
              mytoast.success("Accepted and Order has been created");
            }
          }
        } else if (reject == true) {
          let aboutData = {
            _id: msgData._id,
            text: msgData.text,
            attachment: msgData.attachment,
            sender: msgData.sender,
            senderRole: msgData.senderRole,
            receiver: msgData.receiver,
            receiverRole: msgData.receiverRole,
            conversationID: msgData.conversationID,
            sendedpackageID: msgData.sendedpackageID,
            acceptedPackage: false,
            rejectedPackage: reject,
            quantityPackage: msgData.quantityPackage,
            addedPrice: msgData.addedPrice,
          };
          const res = await updateData(aboutData);
          if (res.status == "Success") {
            socket.emit("msg", "something");
            mytoast.warning("Offer is Rejected");
          }
        }
      }
    }
  };

  useEffect(() => {
    async function getData() {
      const res = await selectData({ packageId: id });
      if (res) {
        setPackageData(res.data[0]);
      }
    }
    getData();
  }, [id]);

  function niceDate(date) {
    var isoTime = date;
    var date = new Date(isoTime);

    var options = {
      month: "long",
      day: "numeric",
    };

    var formattedDate = date.toLocaleDateString("en-US", options);
    return formattedDate;
  }

  if (packageData) {
    return (
      <div className="card-offer">
        <ul>
          <li>
            <span>Package ID: </span>
            <span>{msgData.sendedpackageID}</span>
          </li>
          <li>
            <span>Date: </span>
            <span>{niceDate(msgData.messageUpdateAT)}</span>
          </li>
          <li>
            <span>Quantity: </span>
            <span>{msgData.quantityPackage}</span>
          </li>
          <li>
            <span>Amount due: </span>
            <span>
              $
              {packageData.price * msgData.quantityPackage + msgData.addedPrice}
            </span>
          </li>
        </ul>
        <div className="cta-row">
          <button
            onClick={() =>
              updateMessage(
                packageData.price * msgData.quantityPackage +
                  msgData.addedPrice,
                false,
                true
              )
            }
            className="outline"
          >
            {msgData.rejectedPackage == true
              ? "Offer Rejected"
              : "Reject Offer"}
          </button>
          <button
            onClick={() =>
              updateMessage(
                packageData.price * msgData.quantityPackage +
                  msgData.addedPrice,
                true,
                false
              )
            }
          >
            {msgData.acceptedPackage == true
              ? "Offer Accepted"
              : "Accept Offer"}
          </button>
        </div>
      </div>
    );
  }
};

export default OfferCard;
