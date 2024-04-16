import React, { useState, ChangeEvent, FormEvent } from 'react';
import DefaultLayout from '../layout/DefaultLayout';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
// import axios from 'axios'; // Assuming you use axios for HTTP requests

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
} from "@mui/material";

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
    category: string;
    image: File | null;
    size: string[];
    reviews: Review[];
    price: string;
    description: string;
    couponCode: string;
    isNew: boolean;
    isPopular: boolean;
    isTrending: boolean;
}

const ProductForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        category: "",
        image: null,
        size: [],
        reviews: [
            { comment: "", rating: "", user: { email: "", name: "", img: "" } },
        ],
        price: "",
        description: "",
        couponCode: "DUKAN20",
        isNew: false,
        isPopular: false,
        isTrending: false,
    });

    const categoryOptions = [
        "Winter",
        "Summer",
        "Men",
        "Women",
        "Unisex",
        "Sweatshirt",
    ];

    const handleChange = (e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name as string]: value,
        });
    };

    const handleSwitchChange = (name: keyof FormData) => (e: ChangeEvent<HTMLInputElement>) => {
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
        setFormData({
            ...formData,
            image: file,
        });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle form submission
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Add Product" />
            <form onSubmit={handleSubmit} className="mx-auto max-w-lg text-black dark:text-white">
                <div className="mb-4">
                    <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <FormControl fullWidth>
                        <InputLabel id="category-label">Category *</InputLabel>
                        <Select
                            labelId="category-label"
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={()=>handleChange}
                            required
                        >
                            {categoryOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className="mb-4 flex">
                    <InputLabel htmlFor="image">Image *</InputLabel>
                    <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                        className="mx-10"
                    />
                </div>
                <div className="mb-4">
                    <TextField
                        fullWidth
                        label="Price"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <TextField
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
                <div className="mb-4">
                    <FormControl fullWidth>
                        <InputLabel id="size-label">Size *</InputLabel>
                        <Select
                            labelId="size-label"
                            id="size"
                            name="size"
                            multiple
                            value={formData.size}
                            onChange={()=>handleSizeChange}
                            renderValue={(selected: string[]) => (selected as string[]).join(", ")}
                            required
                        >
                            {["S", "M", "L", "XL"].map((size) => (
                                <MenuItem key={size} value={size}>
                                    <Checkbox checked={formData.size.indexOf(size) > -1} />
                                    <ListItemText primary={size} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className="mb-4">
                    <TextField
                        fullWidth
                        label="Coupon Code"
                        name="couponCode"
                        value={formData.couponCode}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex my-6">
                    <div className="mb-4">
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.isNew}
                                    onChange={handleSwitchChange("isNew")}
                                />
                            }
                            label="Is New"
                        />
                    </div>
                    <div className="mb-4">
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.isPopular}
                                    onChange={handleSwitchChange("isPopular")}
                                />
                            }
                            label="Is Popular"
                        />
                    </div>
                    <div className="mb-4">
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.isTrending}
                                    onChange={handleSwitchChange("isTrending")}
                                />
                            }
                            label="Is Trending"
                        />
                    </div>
                </div>
                <Button variant="contained" type="submit">
                    Submit
                </Button>
            </form>
        </DefaultLayout>
    );
};

export default ProductForm;
