export default [{
        name: "模型加载",
        icon: "MXJZ",
        id: "MXJZ",
    },
    {
        name: "图层管理",
        icon: "TCGL",
        id: "TCGL",
    },
    {
        name: "标签管理",
        icon: "BQGL",
        id: "LabelManagement",
    },
    {
        name: "视角管理",
        icon: "SJGL",
        id: "ViewPointManagement",
        children: [{
                name: "视点管理",
                icon: "SDGL",
                id: "ViewpointManagement",
            },
            {
                name: "默认视角",
                icon: "MRSJ",
                method: "DefaultViewPoint",
                id: "DefaultViewPoint",
            },
        ],
    },
    {
        name: "压平管理",
        icon: "YPGL",
        id: "YPGL",
    },
    {
        name: "水面管理",
        icon: "SMGL",
        id: "SMGL",
    },
    {
        name: "模型偏移",
        icon: "MXPY",
        id: "MXPY",
    },
    {
        name: "GIS场景设置",
        icon: "GISCJSZ",
        id: "GISSceneSettings",
    },
];