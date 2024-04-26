import React, { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import axios from 'axios'; // Import Axios

const Posters = () => {
    const [categories, setCategories] = useState([]);
    const [slides, setSlides] = useState([]);
    const [isEditSlide, setIsEditSlide] = useState(false);
    const [isEditCategory, setIsEditCategory] = useState(false);
    const [categoryFormData, setCategoryFormData] = useState({
        name: '',
        img: { name: '', url: '' },
        srNo: '',
        path: '',
    });
    const [slideFormData, setSlideFormData] = useState({
        name: '',
        img: { name: '', url: '' },
        srNo: '',
        path: '',
    });
    const [slideId, setSlideId] = useState('');
    const [categoryId, setCategoryId] = useState('');

    useEffect(() => {
        // Fetch existing categories and slides on component mount
        fetchPosters();
    }, []);

    const fetchPosters = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/getPosters');
            setCategories(response.data.categories);
            setSlides(response.data.slides);
        } catch (error) {
            console.error('Error fetching posters:', error);
        }
    };
    const clearCategoryFormData = () => {
        setCategoryFormData({
            name: '',
            img: { name: '', url: '' },
            srNo: '',
            path: '',
        });
    };
    const clearSlideFormData = () => {
        setSlideFormData({
            name: '',
            img: { name: '', url: '' },
            srNo: '',
            path: '',
        });
    };
    const handleAddCategory = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        try {
            // Extract image URL from categoryFormData
            const { img, ...formDataWithoutImage } = categoryFormData;
            const { url } = img;

            // Send only the image URL to the backend
            await axios.post(
                'http://localhost:5000/api/category',
                { ...formDataWithoutImage, img: url },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Authorization token
                        user: localStorage.getItem('role'), // User role
                    },
                },
            );
            window.alert('Category added succesfully');

            await fetchPosters();

            // Clear category form data after adding
            clearCategoryFormData();
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    const handleAddSlide = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        try {
            // Extract image URL from slideFormData
            const { img, ...formDataWithoutImage } = slideFormData;
            const { url } = img;

            // Send only the image URL to the backend
            await axios.post(
                'http://localhost:5000/api/slide',
                { ...formDataWithoutImage, img: url },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Authorization token
                        user: localStorage.getItem('role'), // User role
                    },
                },
            );
            window.alert('Slide added succesfully');
            await fetchPosters();
            // Clear slide form data after adding
            clearSlideFormData();
        } catch (error) {
            console.error('Error adding slide:', error);
        }
    };

    const handleEditSlide = (event: any, slide: any) => {
        event.preventDefault();
        setIsEditSlide(true);
        const { name, path, srNo, img, _id } = slide;

        // Assuming slideFormData contains properties for name, path, srNo, and img
        setSlideFormData({
            name,
            path,
            srNo,
            img: {
                name: img,
                url: img,
            },
        });
        setSlideId(_id);
    };

    const editSlideHandler = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        try {
            // Extract image URL from slideFormData
            const { img, ...formDataWithoutImage } = slideFormData;
            const { url } = img;

            // Send only the image URL to the backend
            await axios.put(
                `http://localhost:5000/api/slide/${slideId}`,
                { ...formDataWithoutImage, img: url },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Authorization token
                        user: localStorage.getItem('role'), // User role
                    },
                },
            );
            window.alert('Slide edited succesfully');
            await fetchPosters();
            // Clear slide form data after adding
            clearSlideFormData();
        } catch (error) {
            console.error('Error editing slide:', error);
        }
    };

    const handleEditCategory = (event: any, category: any) => {
        event.preventDefault();

        setIsEditCategory(true);
        const { name, path, srNo, img, _id } = category;

        // Assuming slideFormData contains properties for name, path, srNo, and img
        setCategoryFormData({
            name,
            path,
            srNo,
            img: {
                name: img,
                url: img,
            },
        });
        setCategoryId(_id);

    };

    const editCategoryHandler = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        try {
            // Extract image URL from categoryFormData
            const { img, ...formDataWithoutImage } = categoryFormData;
            const { url } = img;

            // Send only the image URL to the backend
            await axios.put(
                `http://localhost:5000/api/category/${categoryId}`,
                { ...formDataWithoutImage, img: url },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Authorization token
                        user: localStorage.getItem('role'), // User role
                    },
                },
            );
            window.alert('Category edited succesfully');

            await fetchPosters();

            // Clear category form data after adding
            clearCategoryFormData();
        } catch (error) {
            console.error('Error edited category:', error);
        }
    };

    const handleCategoryImageChange = (e: { target: { files: null[] } }) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageUrl = event.target?.result;
                setCategoryFormData({
                    ...categoryFormData,
                    img: { name: file.name, url: imageUrl },
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSlideImageChange = (e: { target: { files: null[] } }) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageUrl = event.target?.result;
                setSlideFormData({
                    ...slideFormData,
                    img: { name: file.name, url: imageUrl },
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteSlide = async (
        event: Event | undefined,
        _slideId: string,
    ) => {
        event?.preventDefault();
        try {
            const response = await axios.delete(
                `http://localhost:5000/api/slide/${_slideId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        user: localStorage.getItem('role'),
                    },
                },
            );
            if (response.data.success) {
                setSlides((prevSlides) =>
                    prevSlides.filter((slide) => slide._id !== _slideId),
                );

                window.alert(response.data.message);
            } else {
                throw new Error('Failed to delete slide');
            }
        } catch (error) {
            console.error('Error deleting slide:', error);
        }
    };
    const handleDeleteCategory = async (
        event: Event | undefined,
        _categoryId: string,
    ) => {
        event?.preventDefault();
        try {
            const response = await axios.delete(
                `http://localhost:5000/api/category/${_categoryId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        user: localStorage.getItem('role'),
                    },
                },
            );
            if (response.data.success) {
                setCategories((prevCategories) =>
                    prevCategories.filter((cat) => cat._id !== _categoryId),
                );

                window.alert(response.data.message);
            } else {
                throw new Error('Failed to delete Category');
            }
        } catch (error) {
            console.error('Error deleting Category:', error);
        }
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Posters" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="sm:grid-cols-2">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                {isEditSlide ? 'Edit' : 'Add'} Slide
                            </h3>
                        </div>
                        <div className="p-7">
                            <form onSubmit={isEditSlide ? editSlideHandler : handleAddSlide}>
                                {/* Slide Image */}

                                <div
                                    id="FileUpload"
                                    className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                                        onChange={handleSlideImageChange}
                                    />
                                    {slideFormData.img.url ? (
                                        <img
                                            src={slideFormData.img.url}
                                            alt="Selected Image"
                                            className="object-cover overflow-hidden w-32"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                                                <svg
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 16 16"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                                                        fill="#3C50E0"
                                                    />
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                                                        fill="#3C50E0"
                                                    />
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                                                        fill="#3C50E0"
                                                    />
                                                </svg>
                                            </span>
                                            <p>
                                                <span className="text-primary">Click to upload</span> or
                                                drag and drop
                                            </p>
                                            <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                                            <p>(max, 800 X 800px)</p>
                                        </div>
                                    )}
                                </div>

                                {/* Slide Name */}
                                <div className="mb-5.5">
                                    <label
                                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                                        htmlFor="name"
                                    >
                                        Name
                                    </label>
                                    <input
                                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                        type="text"
                                        name="name"
                                        id="name"
                                        placeholder="Slide Name"
                                        value={slideFormData.name}
                                        onChange={(e: { target: { value: any } }) =>
                                            setSlideFormData({
                                                ...slideFormData,
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                {/* Slide Serial Number */}
                                <div className="mb-5.5">
                                    <label
                                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                                        htmlFor="srno"
                                    >
                                        Sr.no
                                    </label>
                                    <input
                                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                        type="number"
                                        name="srno"
                                        id="srno"
                                        placeholder="eg: 1"
                                        value={slideFormData.srNo}
                                        onChange={(e: { target: { value: any } }) =>
                                            setSlideFormData({
                                                ...slideFormData,
                                                srNo: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                {/* Slide Path */}
                                <div className="mb-5.5">
                                    <label
                                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                                        htmlFor="path"
                                    >
                                        Path
                                    </label>
                                    <input
                                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                        type="text"
                                        name="path"
                                        id="path"
                                        placeholder="path"
                                        value={slideFormData.path}
                                        onChange={(e: { target: { value: any } }) =>
                                            setSlideFormData({
                                                ...slideFormData,
                                                path: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                {/* Submit Button */}
                                <div className="flex justify-end gap-4.5">
                                    <button
                                        className="flex justify-center rounded  py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                                        type="button"
                                        onClick={clearSlideFormData}
                                    >
                                        Clear
                                    </button>
                                    <button
                                        className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                                        type="submit"
                                    >
                                        {isEditSlide ? 'Edit' : 'Add'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className=" sm:grid-cols-2">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                {isEditCategory ? 'Edit' : 'Add'} Category
                            </h3>
                        </div>
                        <div className="p-7">
                            <form
                                onSubmit={
                                    isEditCategory ? editCategoryHandler : handleAddCategory
                                }
                            >
                                {/* Category Image */}

                                <div
                                    id="FileUpload"
                                    className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute overflow-hidden inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                                        onChange={handleCategoryImageChange}
                                    />
                                    {categoryFormData.img.url ? (
                                        <img
                                            src={categoryFormData.img.url}
                                            alt="Selected Image"
                                            className="object-cover overflow-hidden"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                                                <svg
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 16 16"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                                                        fill="#3C50E0"
                                                    />
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                                                        fill="#3C50E0"
                                                    />
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                                                        fill="#3C50E0"
                                                    />
                                                </svg>
                                            </span>
                                            <p>
                                                <span className="text-primary">Click to upload</span> or
                                                drag and drop
                                            </p>
                                            <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                                            <p>(max, 800 X 800px)</p>
                                        </div>
                                    )}
                                </div>

                                {/* Category Name */}
                                <div className="mb-5.5">
                                    <label
                                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                                        htmlFor="name"
                                    >
                                        Name
                                    </label>
                                    <input
                                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                        type="text"
                                        name="name"
                                        id="name"
                                        placeholder="Category Name"
                                        value={categoryFormData.name}
                                        onChange={(e: { target: { value: any } }) =>
                                            setCategoryFormData({
                                                ...categoryFormData,
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                {/* Category Serial Number */}
                                <div className="mb-5.5">
                                    <label
                                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                                        htmlFor="srno"
                                    >
                                        Sr.no
                                    </label>
                                    <input
                                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                        type="number"
                                        name="srno"
                                        id="srno"
                                        placeholder="eg: 1"
                                        value={categoryFormData.srNo}
                                        onChange={(e: { target: { value: any } }) =>
                                            setCategoryFormData({
                                                ...categoryFormData,
                                                srNo: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                {/* Category Path */}
                                <div className="mb-5.5">
                                    <label
                                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                                        htmlFor="path"
                                    >
                                        Path
                                    </label>
                                    <input
                                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                        type="text"
                                        name="path"
                                        id="path"
                                        placeholder="path"
                                        value={categoryFormData.path}
                                        onChange={(e: { target: { value: any } }) =>
                                            setCategoryFormData({
                                                ...categoryFormData,
                                                path: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                {/* Submit Button */}
                                <div className="flex justify-end gap-4.5">
                                    <button
                                        className="flex justify-center rounded  py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                                        type="button"
                                        onClick={() =>
                                            setCategoryFormData({
                                                name: '',
                                                img: { name: '', url: '' },
                                                srNo: '',
                                                path: '',
                                            })
                                        }
                                    >
                                        Clear
                                    </button>

                                    <button
                                        className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                                        type="submit"
                                    >
                                        {isEditCategory ? 'Edit' : 'Add'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="sm:grid-cols-2">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Slide Preview
                            </h3>
                        </div>
                        <div className="p-7">
                            <form action="#">
                                <div className="mb-4 flex-col items-center gap-3">
                                    {slides.map((slide, _index) => (
                                        <div
                                            key={slide.id}
                                            className="flex rounded-lg bg-white dark:bg-boxdark  flex-row  mb-3"
                                        >
                                            <img
                                                src={slide.img}
                                                alt={slide.name}
                                                className="h-24 w-28 rounded-md border object-cover object-center"
                                            />
                                            <div className="flex flex-col flex-grow px-4">
                                                <span className="font-semibold">{slide.name}</span>
                                                <span className="float-right text-gray-400 text-[14px]">
                                                    {slide.path} - {slide.srNo}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    className="hover:text-primary"
                                                    onClick={() => handleEditSlide(event, slide)}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        fill="currentColor"
                                                        className="bi bi-pencil-square"
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                        <path
                                                            fill-rule="evenodd"
                                                            d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                                                        />
                                                    </svg>
                                                </button>
                                                <button
                                                    className="hover:text-primary"
                                                    onClick={() => handleDeleteSlide(event, slide._id)}
                                                >
                                                    <svg
                                                        className="fill-current"
                                                        width="18"
                                                        height="18"
                                                        viewBox="0 0 18 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                                            fill=""
                                                        />
                                                        <path
                                                            d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                                                            fill=""
                                                        />
                                                        <path
                                                            d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                                                            fill=""
                                                        />
                                                        <path
                                                            d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                                                            fill=""
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className=" sm:grid-cols-2">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Category Preview
                            </h3>
                        </div>
                        <div className="p-7">
                            <form action="#">
                                <div className="mb-4 flex-col items-center gap-3">
                                    {categories.map((category) => (
                                        <div
                                            key={category.id}
                                            className="flex rounded-lg bg-white dark:bg-boxdark  flex-row  mb-3"
                                        >
                                            <img
                                                src={category.img}
                                                alt={category.name}
                                                className="h-24 w-28 rounded-md border object-cover object-center"
                                            />
                                            <div className="flex flex-col flex-grow px-4">
                                                <span className="font-semibold">{category.name}</span>
                                                <span className="float-right text-gray-400 text-[14px]">
                                                    {category.path} - {category.srNo}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    className="hover:text-primary"
                                                    onClick={() => handleEditCategory(event, category)}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        fill="currentColor"
                                                        className="bi bi-pencil-square"
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                        <path
                                                            fill-rule="evenodd"
                                                            d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                                                        />
                                                    </svg>
                                                </button>
                                                <button
                                                    className="hover:text-primary"
                                                    onClick={() =>
                                                        handleDeleteCategory(event, category._id)
                                                    }
                                                >
                                                    <svg
                                                        className="fill-current"
                                                        width="18"
                                                        height="18"
                                                        viewBox="0 0 18 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                                            fill=""
                                                        />
                                                        <path
                                                            d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                                                            fill=""
                                                        />
                                                        <path
                                                            d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                                                            fill=""
                                                        />
                                                        <path
                                                            d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                                                            fill=""
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default Posters;
