// n esquecer de esvaziar
var properties: {[key: string]: {}} = {}

enum CanBeAnnotated {
    "COMPONENT" = "COMPONENT",
    "COMPONENT_SET" = "COMPONENT_SET",
    "ELLIPSE" = "ELLIPSE",
    "FRAME" = "FRAME",
    "INSTANCE" = "INSTANCE",
    "LINE" = "LINE",
    "POLYGON" = "POLYGON",
    "RECTANGLE" = "RECTANGLE",
    "STAR" = "STAR",
    "TEXT" = "TEXT",
    "VECTOR" = "VECTOR"
};


type AnnotationNode = ComponentNode | ComponentSetNode | EllipseNode | FrameNode 
| InstanceNode | LineNode | PolygonNode | RectangleNode | StarNode | TextNode | VectorNode

type LayoutNode = ComponentNode | ComponentSetNode | FrameNode | InstanceNode
type CorneredNode = ComponentNode | ComponentSetNode | EllipseNode | FrameNode | InstanceNode
| PolygonNode | RectangleNode | StarNode | VectorNode

const SharedProperties: (keyof AnnotationNode)[] = [
  "width",
  "height",
  "minWidth",
  "maxWidth",
  "minHeight",
  "maxHeight",
  "fills",
  "strokes",
  "effects",
  "strokeWeight",
  "opacity"
];

// fontName!!
const TextProperties: (keyof TextNode)[] = [
  "textStyleId",
  "textAlignHorizontal",
  "fontSize",
  "fontWeight",
  "lineHeight",
  "letterSpacing",
  "fontName"
]

const GridLayoutProperties: (keyof AnnotationNode)[] = [
  "gridRowAnchorIndex",
  "gridColumnAnchorIndex",
  "gridRowSpan",
  "gridColumnSpan"
]

const LayoutNodeProperties: (keyof LayoutNode)[] = [
  "layoutMode",
  "gridRowGap",
  "gridColumnGap",
  "gridRowCount",
  "gridColumnCount",
  "itemSpacing",
]

const InstanceNodeProperty: keyof InstanceNode = "mainComponent"
const CorneredNodeProperty: keyof CorneredNode = "cornerRadius"

figma.showUI(__html__, {themeColors: true, width: 250, height: 250});

figma.on("selectionchange", () => {
  if(figma.currentPage.selection.length == 1) {
    const selectedNode = figma.currentPage.selection[0]

    if(Object.keys(CanBeAnnotated).includes(selectedNode.type)) {
      selectedNode.setRelaunchData({ add: "Abrir plugin" })

      switch(selectedNode.type) {
        case CanBeAnnotated.COMPONENT:
          const componentNode = selectedNode as ComponentNode
          addSharedProperties(componentNode)

          break
        case CanBeAnnotated.COMPONENT_SET:
          const componentSetNode = selectedNode as ComponentSetNode
          break
        case CanBeAnnotated.ELLIPSE:
          const ellipseNode = selectedNode as EllipseNode
          break
        case CanBeAnnotated.FRAME:
          const frameNode = selectedNode as FrameNode
          break
        case CanBeAnnotated.INSTANCE:
          const instanceNode = selectedNode as InstanceNode
          break
        case CanBeAnnotated.LINE:
          const lineNode = selectedNode as LineNode
          break
        case CanBeAnnotated.POLYGON:
          const polygonNode = selectedNode as PolygonNode
          break
        case CanBeAnnotated.RECTANGLE:
          const rectangleNode = selectedNode as RectangleNode
          break
        case CanBeAnnotated.STAR:
          const starNode = selectedNode as StarNode
          break
        case CanBeAnnotated.TEXT:
          const textNode = selectedNode as TextNode
          addSharedProperties(textNode)
          addTextProperties(textNode)
          addGridLayoutProperties(textNode)
          break
        case CanBeAnnotated.VECTOR:
          const vectorNode = selectedNode as VectorNode
          break
        default:
          // nunca chega aqui, mas por costume vou deixar
          break
      }
    }
  }
})

figma.ui.onmessage = (msg: string) => {
  console.log(msg)
}

// aaa...
// tem q tratar o caso do TextNode
function addProperty(propertiesMap: Map<string, any>, property: string, value: any) {
  if(value instanceof Array) {
      if(value.length > 0)
        propertiesMap.set(property, value)
  } else {
    if(value != null)
      propertiesMap.set(property, value)
  }
}

// pensando na criação dessa função pra diminuição de redundância
// ?
// function addProperties<TNode>(node: TNode, ...properties: ...?) {

// }

function addSharedProperties(node: AnnotationNode) {  
  let sharedProperties: Map<string, any> = new Map()

  for(const prop of SharedProperties) {
    addProperty(sharedProperties, prop, node[prop])
  }

  properties["shared_properties"] = sharedProperties
}

function addTextProperties(node: TextNode) {  
  let textProperties: Map<string, any> = new Map()

  for(const prop of TextProperties) {
    addProperty(textProperties, prop, node[prop])
  }

  properties["text_properties"] = textProperties
}

function addGridLayoutProperties(node: AnnotationNode) {  
  let gridLayoutProperties: Map<string, any> = new Map()

  for(const prop of GridLayoutProperties) {
    addProperty(gridLayoutProperties, prop, node[prop])
  }

  properties["grid_layout_properties"] = gridLayoutProperties
}

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
// figma.ui.onmessage =  (msg: {type: string, count: number}) => {
//   // One way of distinguishing between different types of messages sent from
//   // your HTML page is to use an object with a "type" property like this.
//   if (msg.type === 'create-shapes') {
//     // This plugin creates rectangles on the screen.
//     const numberOfRectangles = msg.count;

//     const nodes: SceneNode[] = [];
//     for (let i = 0; i < numberOfRectangles; i++) {
//       const rect = figma.createRectangle();
//       rect.x = i * 150;
//       rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }];
//       figma.currentPage.appendChild(rect);
//       nodes.push(rect);
//     }
//     figma.currentPage.selection = nodes;
//     figma.viewport.scrollAndZoomIntoView(nodes);
//   }

//   // Make sure to close the plugin when you're done. Otherwise the plugin will
//   // keep running, which shows the cancel button at the bottom of the screen.
//   figma.closePlugin();
// };
