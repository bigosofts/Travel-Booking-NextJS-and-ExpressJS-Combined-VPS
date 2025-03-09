"use client";
import { useEffect, useState } from "react";
import "./CardOffer.css";
import { selectData } from "@/apiservices/travelpackageapiservices.js";
import { updateData } from "@/apiservices/messageapiservices";
import { createData } from "@/apiservices/orderapiservices";
import mytoast from "../toast/toast";
import { useSelector } from "react-redux";
import { createPaymentOrder } from "@/apiservices/paymentProcessApiServices";
import { setToken } from "@/helper/sessionHelper";

const OfferCard = ({ msgData, id, socket }) => {
  const [packageData, setPackageData] = useState();
  const isAdmin = useSelector((state) => state.isAdmin.value);

  // function generateUniqueNumber() {
  //   const currentDate = new Date();
  //   const year = currentDate.getFullYear();
  //   const month = currentDate.getMonth() + 1;
  //   const date = currentDate.getDate();
  //   const hour = currentDate.getHours();
  //   const minute = currentDate.getMinutes();
  //   const second = currentDate.getSeconds();
  //   const millisecond = currentDate.getMilliseconds();

  //   let uniqueNumber = `order-${year}${month}${date}${hour}${minute}${second}${millisecond}`;
  //   return uniqueNumber;
  // }

  const updateMessage = async (totalPrice, accept, reject) => {
    if (isAdmin.data.userRole == "instructor") {
      mytoast.danger("Only client can accept or reject");
    } else {
      if (msgData.acceptedPackage == true) {
        mytoast.warning("Order already created");
      } else {
        if (accept == true) {
          //payment gatway here
          let payBody = {
            amount: parseInt(totalPrice * 100), // convert dollar to cents,
            customerTrns: `Dear ${
              isAdmin.data.userName
            }, thank you for your order request. You have requested the package "${
              packageData.packageTitle
            }" (Package ID: ${msgData.sendedpackageID}) at a price of ${
              packageData.price
            } Dollar (${packageData.price * 100} cents), with a quantity of ${
              msgData.quantityPackage
            }. Additionally, you have an extra charge of ${
              msgData.addedPrice
            } Dollar (${msgData.addedPrice * 100} cents).`,

            customeEmail: isAdmin.data.clientEmail,
            customerName: isAdmin.data.userName,
            customerPhone: isAdmin.data.clientPhone,
            sourceCode: "8362",
            merchantTrns: `Package Creator: ${packageData.createdUser},
            Package Name: ${packageData.packageTitle},
            Package ID: ${msgData.sendedpackageID},
            Package Price: ${packageData.price},
            Package Quantity: ${msgData.quantityPackage},
            Additional Price: ${msgData.addedPrice},
            Client Username: ${isAdmin.data.userName},
            Client Email: ${isAdmin.data.clientEmail},
            Client Phone: ${isAdmin.data.clientPhone}`,

            tags: [
              String(msgData.sendedpackageID),
              String(packageData.createdUser),
              String(isAdmin.data.userName),
              String(isAdmin.data.clientEmail),
              String(isAdmin.data.clientPhone),
            ],
          };

          const resPay = await createPaymentOrder(payBody);
          if (resPay.status === "Success") {
            setToken("orderMsg", {
              orderCode: resPay.orderCode,
              msgId: msgData._id,
            });

            let uniqueNumber = String("order-" + resPay.orderCode);

            let res3 = await createData(
              uniqueNumber,
              msgData.sendedpackageID,
              msgData.sender,
              `Package Creator: ${packageData.createdUser},
            Package Name: ${packageData.packageTitle},
            Package ID: ${msgData.sendedpackageID},
            Package Price: ${packageData.price},
            Package Quantity: ${msgData.quantityPackage},
            Additional Price: ${msgData.addedPrice},
            Client Username: ${isAdmin.data.userName},
            Client Email: ${isAdmin.data.clientEmail},
            Client Phone: ${isAdmin.data.clientPhone}`,
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

            // window.open(resPay.checkoutURL, "_blank");
            window.location.href = resPay.checkoutURL;
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
