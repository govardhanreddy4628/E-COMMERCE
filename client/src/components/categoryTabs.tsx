import React, { useState } from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ProductsSlider from './productsSlider';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


const CategoryTabs = ({ handleClickOpen }) => {

    const tabs = [
        { label: "Fashion", content: <ProductsSlider handleClickOpen={handleClickOpen} /> },
        { label: "Electronics", content: <ProductsSlider handleClickOpen={handleClickOpen} /> },
        { label: "Bags", content: <ProductsSlider handleClickOpen={handleClickOpen} /> },
        { label: "Footwear", content: <ProductsSlider handleClickOpen={handleClickOpen} /> },
        { label: "Groceries", content: <ProductsSlider handleClickOpen={handleClickOpen} /> },
        { label: "Beauty", content: <ProductsSlider handleClickOpen={handleClickOpen} /> },
        { label: "Wellness", content: <ProductsSlider handleClickOpen={handleClickOpen} /> },
        { label: "Jewellery", content: <ProductsSlider handleClickOpen={handleClickOpen} /> },
    ];
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <section className='bg-white w-full dark:bg-gray-900'>
                <div className=' mx-auto flex items-center justify-between'>
                    <div className='flex flex-col w-full'>
                        <Box sx={{ width: '95%' }} className='w-full flex justify-between items-center mx-auto pt-4'>
                            <div className=' flex flex-col justify-start'>
                                <h1 className='text-[24px] font-bold'>Popular Products</h1>
                                <p className='text-[14px] '>Do not miss the current offers until the end of March.</p>
                            </div>

                            <Tabs value={value} onChange={handleChange} aria-label="Category Tabs" variant="scrollable" scrollButtons allowScrollButtonsMobile>
                                {tabs.map((tab, index) => (
                                    <Tab key={index} label={tab.label} {...a11yProps(index)} className='dark:!text-gray-300' />
                                ))}
                            </Tabs>

                        </Box>

                        <Box sx={{ width: '100%' }} >
                            {tabs.map((tab, index) => (
                                <CustomTabPanel key={index} value={value} index={index}>
                                    {tab.content}
                                </CustomTabPanel>
                            ))}
                        </Box>
                    </div>
                </div>
            </section>
        </>
    )
}

export default CategoryTabs
