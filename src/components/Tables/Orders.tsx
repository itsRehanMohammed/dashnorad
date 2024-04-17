import React, { useEffect, useState } from 'react';
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";

import axios from 'axios'; // Import Axios library
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';

const OrderDetails = ({ selectedOrder, userDetails }) => {
  const [deliveryStatus, setDeliveryStatus] = useState("");

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setDeliveryStatus(newStatus);

    try {
      // Send a PUT request to update the delivery status
      await axios.put(
        `http://localhost:5000/api/order/${selectedOrder._id}`,
        [{
          price: selectedOrder.price,
          productImage: selectedOrder.productImage,
          productName: selectedOrder.productName,

          quantity: selectedOrder.quantity,
          status: newStatus
        }], // Request body containing updated status and userDetails
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Authorization token
            user: localStorage.getItem("role"), // User role
          },
        }
      );
      console.log('Delivery status updated successfully!');
    } catch (error) {
      console.error('Error updating delivery status:', error);
    }
  };
  return (
    <div className="px-4 bg-white dark:bg-boxdark">
      {selectedOrder && (
        <div>
          <div className="flex flex-col mt-5 ">
            <div className="flex  rounded-lg bg-white dark:bg-boxdark flex-row relative">
              <img className="h-24 w-28 rounded-md border object-cover object-center" src={selectedOrder.productImage} alt="" />
              <div className="flex flex-col px-4 ">
                <span className="font-semibold">{selectedOrder.productName}</span>

                <p className="text-xs">Qty - {selectedOrder.quantity} color - b</p>
                <p className="font-semibold mt-4"> ₹{selectedOrder.price}</p>
              </div>
            </div>

            {/* Dropdown to update delivery status */}
            <div className="mt-4 ">
              <label htmlFor="deliveryStatus" className="block text-sm font-medium text-gray-700">
                Delivery Status
              </label>
              <select
                id="deliveryStatus"
                name="deliveryStatus"
                className="mt-1 block w-full pl-3 pr-10 py-2 bg-white dark:bg-boxdark text-base border-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={deliveryStatus}
                onChange={handleStatusChange}
              >
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>

            <p className="flex flex-row items-center justify-between mt-10">
              <span className="text-md font-bold"> Your Details: </span>
            </p>
            <p className=" mt-1">{userDetails.userDetails.name}</p>
            <p className=" mt-1">{userDetails.userDetails.phone}</p>
            <p className=" mt-1">{userDetails.userDetails.email}</p>

            <p className="flex flex-row items-center justify-between mt-2">
              <span className="text-md font-semibold"> {userDetails.userDetails.address} </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [orderSummary, setOrderSummary] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const openOrderSummary = (order, user) => {
    setOrderSummary(true);
    setSelectedOrder(order);
    setUserDetails(user);
  };
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/orders');
        if (response.ok) {
          const data = await response.json();
          setOrderData(data);
        } else {
          throw new Error('Failed to fetch order data');
        }
      } catch (error) {
        console.error('Error fetching order data:', error);
      }
    };

    fetchOrderData();
  }, []);

  return (
    <>
      <DefaultLayout>
        <Breadcrumb pageName="Orders" />

        <div className="flex flex-col gap-10">
          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="max-w-full overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-2 text-left dark:bg-meta-4">
                    <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                      Product Name
                    </th>
                    <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                      Product Image
                    </th>
                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                      Quantity
                    </th>
                    <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                      Price
                    </th>
                    <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                      Payment Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orderData.map((order, index) => (
                    order.orders.map((item, key) => (
                      <tr key={key} onClick={() => openOrderSummary(item, order)} className="cursor-pointer">
                        <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                          <h5 className="font-medium text-black dark:text-white">
                            {item.productName}
                          </h5>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                          <img src={item.productImage} alt="Product" className="h-16 w-16 object-cover" />
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black dark:text-white">{item.quantity}</p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black dark:text-white">₹{item.price}</p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-sm text-meta-3">Done</p>
                        </td>
                      </tr>
                    ))
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Drawer open={orderSummary} onClose={() => setOrderSummary(false)} direction="right" ease="ease-in-out" className="bg-white dark:bg-boxdark" style={{ width: "33vw", zIndex: 1000000 }}>
            <div className="flex justify-between border-b-2 p-4 bg-white dark:bg-boxdark">
              <h3>
                Order ID: <span>{selectedOrder?._id}</span>
              </h3>
              <button onClick={() => setOrderSummary(false)} className="text-gray-500">
                X
              </button>
            </div>
            <OrderDetails selectedOrder={selectedOrder} userDetails={userDetails} />
          </Drawer>
        </div>
      </DefaultLayout>

    </>
  );
};

export default Orders;
