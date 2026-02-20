import { getAllCmsElements, getCmsElementBySectionType } from '../../models/cms.model.js';


export async function getAllCms(req, res) {
    try {
        const cmsElement = await getAllCmsElements();
        
        if (!cmsElement) {
            return res.status(404).json({
                success: false,
                message: "No CMS elements found",
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            message: "CMS elements fetched successfully",
            data: cmsElement
        });

    } catch (error) {

        console.error("Error fetching CMS elements:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching CMS elements",
            error: error.message
        });
    }
}

export async function getCmsByElement(req, res) {

    try {
        const { sectionType } = req.params;
        const cmsElementBySection = await getCmsElementBySectionType(sectionType);

        if (!cmsElementBySection) {
            return res.status(404).json({
                success: false,
                message: "No CMS element found",
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            message: "CMS element fetched successfully",
            data: cmsElementBySection
        });
    } catch (error) {
        console.error("Error fetching CMS element:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching CMS element",
            error: error.message
        });
    }
}