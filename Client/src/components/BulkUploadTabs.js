import React, { useState } from "react";

import TabNavItem from "../utilities/Tabs/TabNavItem";
import TabContent from "../utilities/Tabs/TabContent";
import '../utilities/Tabs/bulkupload.css';
import DocumentBulkUpload from "../utilities/Tabs/DocumentBulkUpload";
import ImageBUlkUpload from "../utilities/Tabs/ImageBulkUpload";


const BulkUploadTabs = () => {
    const [activeTab, setActiveTab] = useState("tab1");
    return (
        <div>
            <ul className="nav">
                {/* <li>Images Bulk Upload</li>
                <li>Documents Bulk Upload</li>
                <li>Audios Bulk Upload</li>
                <li>Videos Bulk Upload</li> */}
                <TabNavItem title="Images Bulk Upload" id="tab1" activeTab={activeTab} setActiveTab={setActiveTab}/>
                <TabNavItem title="Documents Bulk Upload" id="tab2" activeTab={activeTab} setActiveTab={setActiveTab}/>
                <TabNavItem title="Audios Bulk Upload" id="tab3" activeTab={activeTab} setActiveTab={setActiveTab}/>
                <TabNavItem title="Videos Bulk Upload" id="tab4" activeTab={activeTab} setActiveTab={setActiveTab}/>
            </ul>
            <div className="outlet">
                {/* content will be shown here */}
                <TabContent id="tab1" activeTab={activeTab} >
                    <ImageBUlkUpload />
                </TabContent>
                <TabContent id="tab2" activeTab={activeTab} >
                    <DocumentBulkUpload />
                </TabContent>
                <TabContent id="tab3" activeTab={activeTab} >
                    <p>Future Implementation </p>
                </TabContent>
                <TabContent id="tab4" activeTab={activeTab} >
                    <p>Future Implementation </p>
                </TabContent>
            </div>
        </div>
    )
};
export default BulkUploadTabs;
