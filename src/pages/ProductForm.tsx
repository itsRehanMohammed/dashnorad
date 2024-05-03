import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import DefaultLayout from '../layout/DefaultLayout';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import {
    TextField,
    Switch,
    FormControlLabel,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Checkbox,
    ListItemText,
} from '@mui/material';

interface Review {
    comment: string;
    rating: string;
    user: {
        email: string;
        name: string;
        img: string;
    };
}

interface FormData {
    name: string;
    category: string[];
    image: object | null;
    imageUrl: string | null; // Added imageUrl field to hold the URL of the selected image
    size: string[];
    reviews: Review[];
    price: string;
    description: string;
    couponCode: string;
    isNew: boolean;
    isPopular: boolean;
    isTrending: boolean;
    quantity: number;
}

const ProductForm: React.FC = ({ product, handleClearEditProduct }) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        category: [],
        image: { name: '', url: '' },
        imageUrl: null,
        size: [],
        reviews: [],
        price: '',
        description: '',
        couponCode: 'DUKAN20',
        isNew: false,
        isPopular: false,
        isTrending: false,
        quantity: 1,
    });
    useEffect(() => {
        if (product) {
            setFormData({
                ...product,
                category: product.category.map((cat) => cat.name), // Map category objects to category names
            });
        }
        console.log({ product });

    }, [product]);
    const categoryOptions = [
        'winter',
        'summer',
        'men',
        'women',
        'unisex',
        'sweatshirt',
    ];

    const handleChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
        >,
    ) => {
        const { name, value } = e.target;

        if (name === 'category') {
            // Convert value to array if it's not already an array
            const categoryValue = Array.isArray(value) ? value : [value];
            setFormData({
                ...formData,
                category: categoryValue,
            });
        } else {
            setFormData({
                ...formData,
                [name as string]: value,
            });
        }
    };

    const handleSwitchChange =
        (name: keyof FormData) => (e: ChangeEvent<HTMLInputElement>) => {
            console.log({ name }, e.target.checked);

            setFormData({
                ...formData,
                [name]: e.target.checked,
            });
        };

    const handleSizeChange = (e: ChangeEvent<{ value: unknown }>) => {
        const selectedSizes = e.target.value as string[];
        setFormData({
            ...formData,
            size: selectedSizes,
        });
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageUrl = event.target?.result;
                setFormData({
                    ...formData,
                    image: { name: file.name, url: imageUrl },
                    imageUrl: URL.createObjectURL(file),
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClear = () => {
        setFormData({
            name: '',
            category: [],
            image: { name: '', url: '' },
            imageUrl: null,
            size: [],
            reviews: [],
            price: '',
            description: '',
            couponCode: '',
            isNew: false,
            isPopular: false,
            isTrending: false,
            quantity: 1,
        });
    };
    // Function to generate unique IDs for each category
    const generateUniqueIds = (categories: string[]) => {
        const uniqueCategories: { id: string; name: string }[] = [];

        categories.forEach((categoryName) => {
            // Create a unique ID for each category
            const id =
                categoryName.toLowerCase().replace(/\s/g, '-') + '-' + Date.now();
            uniqueCategories.push({ id, name: categoryName });
        });

        return uniqueCategories;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log({ formData });

        try {
            const formattedCategories = generateUniqueIds(formData.category);

            const formDataToSend = {
                name: formData.name,
                category: formattedCategories,
                image: formData.image?.url || formData.image,
                size: formData.size,
                reviews: formData.reviews,
                price: parseFloat(formData.price),
                quantity: parseFloat(formData.quantity),
                description: formData.description,
                couponCode: formData.couponCode,
                isNew: formData.isNew,
                isPopular: formData.isPopular,
                isTrending: formData.isTrending,
            };

            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDataToSend),
            });

            if (response.ok) {
                handleClear();
                alert('Product added successfully!');
            } else {
                throw new Error('Failed to add product');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product. Please try again later.');
        }
    };
    const handleEditProductSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log({ formData });

        try {
            const formattedCategories = generateUniqueIds(formData.category);

            const formDataToSend = {
                name: formData.name,
                category: formattedCategories,
                image: formData.image?.url || formData.image,
                size: formData.size,

                price: parseFloat(formData.price),
                quantity: parseFloat(formData.quantity),
                description: formData.description,
                couponCode: formData.couponCode,
                isNew: formData.isNew,
                isPopular: formData.isPopular,
                isTrending: formData.isTrending,
            };

            const response = await fetch(`http://localhost:5000/api/products/${formData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDataToSend),
            });

            if (response.ok) {
                alert('Product edited successfully!');
            } else {
                throw new Error('Failed to edit product');
            }
        } catch (error) {
            console.error('Error editing product:', error);
            alert('Failed to edit product. Please try again later.');
        }
    };

    return (
        <>
            {product ? (
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark py-4">
                    <button onClick={handleClearEditProduct} className="mx-6" > ⬅ back</button>
                    <form
                        onSubmit={handleEditProductSubmit}
                        className="mx-5 sm:mx-auto max-w-2xl text-black dark:text-white mt-10"
                    >
                        <div className="mb-5 ">
                            <TextField
                                InputLabelProps={{
                                    className: 'text-black dark:text-white',
                                }}
                                fullWidth
                                label="Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    className:
                                        'disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary',
                                }}
                            />
                        </div>
                        <div className="flex items-center">
                            <div className="mb-5 flex-1">
                                <FormControl fullWidth>
                                    <InputLabel className={'dark:text-white'} id="category-label">
                                        Category *
                                    </InputLabel>
                                    <Select
                                        labelId="category-label"
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                        multiple // Enable multiple selections
                                        className="disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    >
                                        {categoryOptions.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="mb-5 ml-2 flex-1">
                                <TextField
                                    InputLabelProps={{
                                        className: 'text-black dark:text-white',
                                    }}
                                    InputProps={{
                                        className:
                                            'disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary',
                                    }}
                                    fullWidth
                                    label="Price"
                                    name="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-5">
                            <TextField
                                InputLabelProps={{
                                    className: 'text-black dark:text-white',
                                }}
                                InputProps={{
                                    className:
                                        'disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary',
                                }}
                                fullWidth
                                label="Description"
                                name="description"
                                multiline
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="flex items-center">
                            <div className="mb-5 flex-1">
                                <FormControl fullWidth>
                                    <InputLabel className={'dark:text-white '} id="size-label">
                                        Size *
                                    </InputLabel>
                                    <Select
                                        labelId="size-label"
                                        id="size"
                                        name="size"
                                        multiple
                                        value={formData.size}
                                        onChange={handleSizeChange} // Fix: Pass the handleSizeChange function here
                                        renderValue={(selected: string[]) => selected.join(', ')}
                                        required
                                        className="disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    >
                                        {['S', 'M', 'L', 'XL'].map((size) => (
                                            <MenuItem key={size} value={size}>
                                                <Checkbox checked={formData.size.indexOf(size) > -1} />
                                                <ListItemText primary={size} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="mb-5 ml-2 flex-1">
                                <TextField
                                    InputLabelProps={{
                                        className: 'text-black dark:text-white',
                                    }}
                                    InputProps={{
                                        className:
                                            'disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary',
                                    }}
                                    fullWidth
                                    label="Quantity"
                                    name="quantity"
                                    type="number"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-5">
                            <TextField
                                InputLabelProps={{
                                    className: 'text-black dark:text-white',
                                }}
                                InputProps={{
                                    className:
                                        'disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary',
                                }}
                                fullWidth
                                label="Coupon Code"
                                name="couponCode"
                                value={formData.couponCode}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-5">
                            <InputLabel
                                InputLabelProps={{
                                    className: 'text-black dark:text-white',
                                }}
                                className={'dark:text-white mb-2'}
                                htmlFor="image"
                            >
                                Image *
                            </InputLabel>

                            <div className="flex items-center justify-center w-full">
                                <label
                                    htmlFor="dropzone-file"
                                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                >

                                    <img
                                        src={formData.image.url || product.image}
                                        alt="Selected Image"
                                        className=" object-cover overflow-hidden"
                                    />

                                    <input
                                        required={!formData.image.url && !product.image}
                                        id="dropzone-file"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="flex my-6">
                            <div className="mb-5">
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.isNew}
                                            onChange={handleSwitchChange('isNew')}
                                        />
                                    }
                                    label="Is New"
                                />
                            </div>
                            <div className="mb-5">
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.isPopular}
                                            onChange={handleSwitchChange('isPopular')}
                                        />
                                    }
                                    label="Is Popular"
                                />
                            </div>
                            <div className="mb-5">
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.isTrending}
                                            onChange={handleSwitchChange('isTrending')}
                                        />
                                    }
                                    label="Is Trending"
                                />
                            </div>
                        </div>
                        <Button variant="contained" type="submit">
                            Edit Product
                        </Button>
                        <Button onClick={handleClearEditProduct}>Cancel</Button>
                    </form>
                </div>
            ) : (
                <DefaultLayout>
                    <Breadcrumb pageName="Add Product" />
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark py-4">
                        <form
                            onSubmit={handleSubmit}
                            className="mx-5 sm:mx-auto  max-w-2xl text-black dark:text-white mt-10"
                        >
                            <div className="mb-5 ">
                                <TextField
                                    InputLabelProps={{
                                        className: 'text-black dark:text-white',
                                    }}
                                    fullWidth
                                    label="Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    InputProps={{
                                        className:
                                            'disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary',
                                    }}
                                />
                            </div>
                            <div className="flex items-center">
                                <div className="mb-5 flex-1">
                                    <FormControl fullWidth>
                                        <InputLabel className={'dark:text-white'} id="category-label">
                                            Category *
                                        </InputLabel>
                                        <Select
                                            labelId="category-label"
                                            id="category"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            required
                                            multiple // Enable multiple selections
                                            className="disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        >
                                            {categoryOptions.map((option) => (
                                                <MenuItem key={option} value={option}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="mb-5 ml-2 flex-1">
                                    <TextField
                                        InputLabelProps={{
                                            className: 'text-black dark:text-white',
                                        }}
                                        InputProps={{
                                            className:
                                                'disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary',
                                        }}
                                        fullWidth
                                        label="Price"
                                        name="price"
                                        type="number"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-5">
                                <TextField
                                    InputLabelProps={{
                                        className: 'text-black dark:text-white',
                                    }}
                                    InputProps={{
                                        className:
                                            'disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary',
                                    }}
                                    fullWidth
                                    label="Description"
                                    name="description"
                                    multiline
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex items-center">
                                <div className="mb-5 flex-1">
                                    <FormControl fullWidth>
                                        <InputLabel className={'dark:text-white '} id="size-label">
                                            Size *
                                        </InputLabel>
                                        <Select
                                            labelId="size-label"
                                            id="size"
                                            name="size"
                                            multiple
                                            value={formData.size}
                                            onChange={handleSizeChange} // Fix: Pass the handleSizeChange function here
                                            renderValue={(selected: string[]) => selected.join(', ')}
                                            required
                                            className="disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        >
                                            {['S', 'M', 'L', 'XL'].map((size) => (
                                                <MenuItem key={size} value={size}>
                                                    <Checkbox checked={formData.size.indexOf(size) > -1} />
                                                    <ListItemText primary={size} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="mb-5 ml-2 flex-1">
                                    <TextField
                                        InputLabelProps={{
                                            className: 'text-black dark:text-white',
                                        }}
                                        InputProps={{
                                            className:
                                                'disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary',
                                        }}
                                        fullWidth
                                        label="Quantity"
                                        name="quantity"
                                        type="number"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-5">
                                <TextField
                                    InputLabelProps={{
                                        className: 'text-black dark:text-white',
                                    }}
                                    InputProps={{
                                        className:
                                            'disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary',
                                    }}
                                    fullWidth
                                    label="Coupon Code"
                                    name="couponCode"
                                    value={formData.couponCode}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-5">
                                <InputLabel
                                    InputLabelProps={{
                                        className: 'text-black dark:text-white',
                                    }}
                                    className={'dark:text-white mb-2'}
                                    htmlFor="image"
                                >
                                    Image *
                                </InputLabel>

                                <div className="flex items-center justify-center w-full">
                                    <label
                                        htmlFor="dropzone-file"
                                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                    >
                                        {formData.imageUrl ? (
                                            <img
                                                src={formData.imageUrl}
                                                alt="Selected Image"
                                                className=" object-cover overflow-hidden"
                                            />
                                        ) : (
                                            <>
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <svg
                                                        className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                                        aria-hidden="true"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 20 16"
                                                    >
                                                        <path
                                                            stroke="currentColor"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                                        />
                                                    </svg>
                                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="font-semibold">Click to upload</span>
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                        <input
                                            required
                                            id="dropzone-file"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="flex my-6">
                                <div className="mb-5">
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formData.isNew}
                                                onChange={handleSwitchChange('isNew')}
                                            />
                                        }
                                        label="Is New"
                                    />
                                </div>
                                <div className="mb-5">
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formData.isPopular}
                                                onChange={handleSwitchChange('isPopular')}
                                            />
                                        }
                                        label="Is Popular"
                                    />
                                </div>
                                <div className="mb-5">
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formData.isTrending}
                                                onChange={handleSwitchChange('isTrending')}
                                            />
                                        }
                                        label="Is Trending"
                                    />
                                </div>
                            </div>
                            <Button variant="contained" type="submit">
                                Add Product
                            </Button>
                            <Button onClick={handleClear}>Clear</Button>
                        </form>
                    </div>
                </DefaultLayout>
            )}
        </>
    );
};

export default ProductForm;
