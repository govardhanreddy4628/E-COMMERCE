import React, { useState } from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ProductsSlider from './productsSlider';


const tabs = [
    { label: "Fashion", content: <div>Fashion Content</div> },
    { label: "Electronics", content: <div>Electronics Content</div> },
    { label: "Bags", content: <div>Bags Content</div> },
    { label: "Footwear", content: <div>Footwear Content</div> },
    { label: "Groceries", content: <div>Groceries Content</div> },
    { label: "Beauty", content: <div>Beauty Content</div> },
    { label: "Wellness", content: <div>Wellness Content</div> },
    { label: "Jewellery", content: <div>Jewellery Content</div> },
];

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
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


const CategoryTabs = () => {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <section className='bg-white w-full pb-4 dark:bg-gray-900'>
                <div className='w-[95%] mx-auto flex items-center justify-between p-4'>

                    <div className='w-[30%] flex flex-col justify-start'>
                        <h1 className='text-[24px] font-bold'>Popular Products</h1>
                        <p className='text-[14px] '>Do not miss the current offers until the end of March.</p>
                    </div>

                    <div className='w-[70%] flex justify-end'>
                        <Box sx={{ width: '100%' }}>
                            <Box>
                                <Tabs value={value} onChange={handleChange} aria-label="Category Tabs" variant="scrollable" scrollButtons allowScrollButtonsMobile>
                                    {tabs.map((tab, index) => (
                                        <Tab key={index} label={tab.label} {...a11yProps(index)} className='dark:!text-gray-300'/>
                                    ))}
                                </Tabs>
                            </Box>
                            {tabs.map((tab, index) => (
                                <CustomTabPanel key={index} value={value} index={index}>
                                    {tab.content}
                                </CustomTabPanel>
                            ))}

                        </Box>
                    </div>
                </div>

                <ProductsSlider/>
                
            </section>
        </>
    )
}

export default CategoryTabs
