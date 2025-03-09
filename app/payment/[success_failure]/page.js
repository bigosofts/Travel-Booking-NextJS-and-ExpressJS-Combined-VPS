"use client";
import { TiTick } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import "./confirmpage.css";
import { getToken, removeToken } from "@/helper/sessionHelper";
import { checkTransactions } from "@/apiservices/paymentProcessApiServices";
import {
  updateData as updateMessage,
  selectData as selectMessage,
} from "@/apiservices/messageapiservices";
import {
  updateData as updateOrder,
  selectData as selectOrder,
} from "@/apiservices/orderapiservices";
import mytoast from "@/components/toast/toast";
import io from "socket.io-client";

export default function Success_Failure({ params }) {
  function push(url) {
    window.location.href = url;
  }
  let searchParams = useSearchParams();
  let orderId = searchParams.get("s");
  let transactionId = searchParams.get("t");

  useEffect(() => {
    if (orderId && !transactionId) {
      removeToken("orderMsg");
    } else if (orderId && transactionId) {
      const { orderCode, msgId } = getToken("orderMsg");

      async function checkTransactionsFunc(id) {
        const res = await checkTransactions({ transactionId: id });

        if (res.status == "Success") {
          const [resOrder, resMessage] = await Promise.all([
            selectOrder({ orderID: `order-${orderCode}` }, null),
            selectMessage({ _id: msgId }, null),
          ]);

          if (resOrder.status == "Success" && resMessage.status == "Success") {
            let aboutData = {
              _id: resMessage.data[0]._id,
              text: `${resMessage.data[0].text}. Your Transaction ID is: ${transactionId}`,
              attachment: resMessage.data[0].attachment,
              sender: resMessage.data[0].sender,
              senderRole: resMessage.data[0].senderRole,
              receiver: resMessage.data[0].receiver,
              receiverRole: resMessage.data[0].receiverRole,
              conversationID: resMessage.data[0].conversationID,
              sendedpackageID: resMessage.data[0].sendedpackageID,
              acceptedPackage: true,
              rejectedPackage: false,
              quantityPackage: resMessage.data[0].quantityPackage,
              addedPrice: resMessage.data[0].addedPrice,
            };

            const resMessageUpdate = await updateMessage(aboutData);
            if (resMessageUpdate.status == "Success") {
              mytoast.success("Offer message has been modified");
            }

            const resOrderUpdate = await updateOrder(
              resOrder.data[0]._id,
              resOrder.data[0].orderID,
              resOrder.data[0].packageID,
              resOrder.data[0].instructorID,
              resOrder.data[0].orderDescription,
              "completed",
              resOrder.data[0].orderPrice,
              resOrder.data[0].orderNumber,
              resOrder.data[0].activeStatus,
              resOrder.data[0].clientID
            );

            if (resOrderUpdate.status == "Success") {
              mytoast.success("Your order has been modified");
            }

            console.log(resOrder.data[0], resMessage.data[0]);
          }
        } else {
          const [resOrder, resMessage] = await Promise.all([
            selectOrder({ orderID: `order-${orderCode}` }, null),
            selectMessage({ _id: msgId }, null),
          ]);

          if (resOrder.status == "Success" && resMessage.status == "Success") {
            let aboutData = {
              _id: resMessage.data[0]._id,
              text: `${resMessage.data[0].text}. Your Transaction ID is: ${transactionId}`,
              attachment: resMessage.data[0].attachment,
              sender: resMessage.data[0].sender,
              senderRole: resMessage.data[0].senderRole,
              receiver: resMessage.data[0].receiver,
              receiverRole: resMessage.data[0].receiverRole,
              conversationID: resMessage.data[0].conversationID,
              sendedpackageID: resMessage.data[0].sendedpackageID,
              acceptedPackage: true,
              rejectedPackage: false,
              quantityPackage: resMessage.data[0].quantityPackage,
              addedPrice: resMessage.data[0].addedPrice,
            };

            const resMessageUpdate = await updateMessage(aboutData);
            if (resMessageUpdate.status == "Success") {
              mytoast.success("Offer message has been modified");
            }

            const resOrderUpdate = await updateOrder(
              resOrder.data[0]._id,
              resOrder.data[0].orderID,
              resOrder.data[0].packageID,
              resOrder.data[0].instructorID,
              resOrder.data[0].orderDescription,
              "pending",
              resOrder.data[0].orderPrice,
              resOrder.data[0].orderNumber,
              resOrder.data[0].activeStatus,
              resOrder.data[0].clientID
            );

            if (resOrderUpdate.status == "Success") {
              mytoast.success("Your order has been modified");
            }

            console.log(resOrder.data[0], resMessage.data[0]);
          }
        }
      }
      checkTransactionsFunc(transactionId);
      removeToken("orderMsg");
    }
  }, []);

  if (params.success_failure == "success") {
    return (
      <div className="payment-container">
        <div className="payment-box">
          <div className="tick-container">
            <TiTick className="tick-icon" />
          </div>
          <div className="content">
            <div className="class-price">Congratulations !</div>
            <h1 className="payment-title">
              Your payment request has been received successfully
            </h1>
            <p className="payment-message">
              Now please contact back to your tour guide or instructor again
              about your payment completion. He will verify your payment and
              give you a ticket
            </p>
            <button
              onClick={() => push("/dashboard/loading")}
              className="dashboard-button"
            >
              Go back to your dashboard
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="payment-container">
        <div className="payment-box">
          <div className="tick-container">
            <IoClose className="close-icon" />
          </div>
          <div className="content">
            <div className="class-price">Sorry !</div>
            <h1 className="payment-title">
              Your payment request has been denied somehow
            </h1>
            <p className="payment-message">
              Please retry again from your message section or talk to your tour
              guide about the problem
            </p>
            <button
              onClick={() => push("/dashboard/loading")}
              className="dashboard-button"
            >
              Go back to your dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }
}
