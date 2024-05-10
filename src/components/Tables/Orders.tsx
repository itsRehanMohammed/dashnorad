import React, { useEffect, useState } from 'react';
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";

import axios from 'axios'; // Import Axios library
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { ConfirmDeleteModal } from './Products';

const OrderDetails = ({ selectedOrder, userDetails }) => {
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleCancel = () => {
    handleStatusChange(null, "cancel");
    setShowConfirmation(false);
  };

  const handleStatusChange = async (e, status) => {
    const newStatus = e ? e.target.value : status;
    setDeliveryStatus(newStatus);
    console.log({ selectedOrder, userDetails });

    try {
      // Send a PUT request to update the delivery status
      await axios.put(
        `http://localhost:5000/api/order/${userDetails._id}`,
        {
          orderId: selectedOrder._id,
          status: newStatus
        }, // Request body containing updated status and userDetails
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Authorization token
            user: localStorage.getItem("role"), // User role
          },
        }
      );

      alert('Delivery status updated successfully!');
    } catch (error) {
      console.error('Error updating delivery status:', error);
      if (error.response && error.response.status === 401) {
        alert('Unauthorized! Please check if you have correct access right to update the order.');
      } else {
        alert('Failed to update delivery status. Please try again later.');
      }
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
            {selectedOrder.status !== 'cancel' && selectedOrder.status !== 'delivered' ? <div className="mt-4 ">
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
                <option value={deliveryStatus}>{deliveryStatus ? deliveryStatus : "update me"}</option>
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div> : selectedOrder.status === 'delivered' && <div className="text-green-500 mt-6" > Order Delivered</div>}
            <div>
              <div>
                {selectedOrder.status !== 'cancel' && selectedOrder.status !== 'delivered' ? <button
                  onClick={() => setShowConfirmation(true)}
                  className="bg-red-500  hover:bg-red-600 text-white font-bold mt-6 py-2 px-4 rounded"
                >
                  Cancel Order
                </button> : selectedOrder.status === 'cancel' && <div className="text-orange-500 mt-6" > Order Canceled</div>}
                {showConfirmation && (
                  <div className=" z-10 overflow-y-auto">
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to cancel this order? This action cannot be undone.
                      </p>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button onClick={handleCancel} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                        Confirm
                      </button>
                      <button onClick={() => setShowConfirmation(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
            <p className="flex flex-row items-center justify-between mt-10">
              <span className="text-md font-bold"> Customer Details: </span>
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
  const [searchTerm, setSearchTerm] = useState("");

  // Function to handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Function to filter orders based on search term
  const filteredOrders = orderData.filter((order) => {
    // Filter based on user email, phone number, product name, and order ID
    return (
      order.userDetails.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userDetails.phone.toString().includes(searchTerm) ||
      order.orders.some((item) =>
        item.productName.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      order.orders.some((item) =>
        item._id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  });


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

  const openOrderSummary = (order, user) => {
    setOrderSummary(true);
    setSelectedOrder(order);
    setUserDetails(user);
  };


  return (
    <>
      <DefaultLayout>
        <Breadcrumb pageName="Orders" />

        <div className="flex flex-col gap-10">
          <div className="rounded-sm border border-stroke bg-white px-1 sm:px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="max-w-full overflow-x-auto">
              <div className="mb-4 flex  align-center">
                <svg
                  className="mt-2 mr-1 fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                    fill=""
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                    fill=""
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search by email, phone, order Id or product name..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="block w-1/2 px-3 py-2 focus:outline-none focus:border-none dark:bg-boxdark dark:text-white rounded-none shadow-none"
                />
                <div className="ml-auto mt-2" >{filteredOrders.length} orders</div>
              </div>
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-2 text-left dark:bg-meta-4">
                    <th className="hidden sm:table-cell min-w-[120px] sm:min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                      Product Name
                    </th>
                    <th className=" min-w-[130px] sm:min-w-[220px] py-4  px-4 font-medium text-black dark:text-white xl:pl-11">
                      {window.innerWidth < 500 ? "Product" : "Product Image"}
                    </th>
                    <th className="min-w-[100px] sm:min-w-[150px] py-4  px-4 font-medium text-black dark:text-white">
                      Quantity
                    </th>
                    <th className="hidden sm:table-cell min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                      Price
                    </th>
                    <th className="min-w-[150px] py-4  px-4 font-medium text-black dark:text-white">
                      {window.innerWidth < 500 ? "Status" : "Delivery Status"}
                    </th>
                    <th className=" hidden sm:table-cell min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                      Payment
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? filteredOrders.map((order, index) => (
                    order.orders.map((item, key) => (
                      <tr key={key} onClick={() => openOrderSummary(item, order)} className="cursor-pointer">
                        <td className=" hidden sm:table-cell border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                          <h5 className="font-medium text-black dark:text-white">
                            {item.productName}
                          </h5>
                        </td>

                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                          <img src={item.productImage} alt="Product" className="h-16 w-16 object-cover" />
                        </td>
                        <td className="border-b border-[#eee] py-5 px-8 dark:border-strokedark">
                          <p className="text-black dark:text-white">{item.quantity}</p>
                        </td>
                        <td className="hidden sm:table-cell border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black dark:text-white">₹{item.price}</p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className={` ${item.status === 'delivered' ? 'text-meta-3' : item.status === 'cancel' ? 'text-red-500' : 'text-black dark:text-white'} `}>{item.status}</p>
                        </td>
                        <td className="hidden sm:table-cell border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-sm text-meta-3">Done</p>
                        </td>
                      </tr>
                    ))
                  )) : <div className="py-6 px-6 text-center text-2xl text-gray-500 dark:text-gray-400" >No order found</div>}
                </tbody>
              </table>
            </div>
          </div>
          <Drawer open={orderSummary} onClose={() => setOrderSummary(false)} direction="right" ease="ease-in-out" className="bg-white dark:bg-boxdark" style={{ width: window.innerWidth > 1000 ? "33vw" : "100vw", zIndex: 1000000 }}>
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
