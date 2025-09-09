/**
 * falta padding, alignItems e fontName
 */

// tirar redundancia de PaintProperties
// criar algo relacionado a SimpleMixed

type RGB255 = {
  r: number;
  g: number;
  b: number;
}

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

enum WeirdProperties {
  "fills" = "fills",
  "strokeWeight" = "strokeWeight",
  "textStyleId" = "textStyleId",
  "fontSize" = "fontSize",
  "fontWeight" = "fontWeight",
  "lineHeight" = "lineHeight",
  "letterSpacing" = "letterSpacing",
  "cornerRadius" = "cornerRadius",
  "padding" = "padding",
  "strokes" = "strokes", 
  "effects" = "effects",
  "fontName" = "fontName",
  "mainComponent" = "mainComponent"
}


// n esquecer de esvaziar
var properties: {[key: string]: {}} = {}

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

const PaddingProperties: (keyof LayoutNode)[] = [
  "paddingBottom",
  "paddingLeft",
  "paddingRight",
  "paddingTop"
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
          // addSharedProperties(textNode)
          // addTextProperties(textNode)
          // addGridLayoutProperties(textNode)
          break
        case CanBeAnnotated.VECTOR:
          const vectorNode = selectedNode as VectorNode
          break
      }
    }
  }
})

figma.ui.onmessage = (msg: string) => {
  console.log(msg)
}

function RGBtoRGB255(r: number, g: number, b: number) {
  let rgb255: RGB255 = {r: 0, g: 0, b: 0};
  rgb255.r = Math.trunc(r * 255)
  rgb255.r = Math.trunc(g * 255)
  rgb255.r = Math.trunc(b * 255)

  return rgb255;
}

// eu poderia deixar todas as funções como addProperty (overloading), mas prefiro deixar assim pra melhorar a leitura
function addFillsProperty(propertiesMap: Map<string, any>, fills: MinimalFillsMixin["fills"]) {
  if(fills !== figma.mixed) {
    // só entra se tiver apenas um fill, então posso pegar só o primeiro valor e vai dar certo
    let fillValue;
    let opacity = fills[0].opacity
    let fill = fills[0]

    switch(fill.type) {
      case "SOLID":
        let rgbColor = (fill as SolidPaint).color
        let rgb255Color = RGBtoRGB255(rgbColor.r, rgbColor.g, rgbColor.b)
        fillValue = `rgb(${rgb255Color.r}, ${rgb255Color.g}, ${rgb255Color.b})`
        break
      case "GRADIENT_LINEAR":
        fillValue = "Linear Gradient"
        break
      case "GRADIENT_RADIAL":
        fillValue = "Radial Gradient"
        break
      case "GRADIENT_ANGULAR":
        fillValue = "Angular Gradient"
        break
      case "GRADIENT_DIAMOND":
        fillValue = "Diamond Gradient"
        break
      case "IMAGE":
        fillValue = "Image"
        break
      case "VIDEO":
        fillValue = "Video"
        break
      case "PATTERN":
        fillValue = "Pattern"
    }

    if(opacity && opacity < 1)
      fillValue += " - " + (opacity *= 100).toFixed(0)
    
    propertiesMap.set("fills", fillValue)
  } else {
    propertiesMap.set("fills", "Multiple")
  }
}

function addStrokeWeightProperty(propertiesMap: Map<string, any>, strokeWeight: MinimalStrokesMixin["strokeWeight"]) {
  if(strokeWeight !== figma.mixed) {
    propertiesMap.set("strokeWeight", strokeWeight)
  } else {
    propertiesMap.set("strokeWeight", "Mixed")
  }
}

function addTextStyleIdProperty(propertiesMap: Map<string, any>, textStyleId: string | typeof figma.mixed) {
  if(textStyleId !== figma.mixed) {
    propertiesMap.set("textStyleId", textStyleId)
  } else {
    propertiesMap.set("textStyleId", "Mixed")
  }
}

function addFontSizeProperty(propertiesMap: Map<string, any>, fontSize: number | typeof figma.mixed) {
  if(fontSize !== figma.mixed) {
    propertiesMap.set("fontSize", fontSize)
  } else {
    propertiesMap.set("fontSize", "Mixed")
  }
}

function addFontWeightProperty(propertiesMap: Map<string, any>, fontWeight: number | typeof figma.mixed) {  
  if(fontWeight !== figma.mixed) {
    propertiesMap.set("fontWeight", fontWeight)
  } else {
    propertiesMap.set("fontSize", "Mixed")
  }
}

function addLineHeightProperty(propertiesMap: Map<string, any>, lineHeight: NonResizableTextMixin["lineHeight"]) {
  if(lineHeight !== figma.mixed) {
    let lineHeightValue;

    switch(lineHeight.unit) {
      case "PIXELS":
        lineHeightValue = `${lineHeight.value}px`
        break
      case "PERCENT":
        lineHeightValue = `${lineHeight.value}%`
        break 
      case "AUTO":
        lineHeightValue = "Auto"
        break
    }

    propertiesMap.set("lineHeight", lineHeightValue)
  } else {
    propertiesMap.set("lineHeight", "Mixed")
  }
}

// repetir algumas vezes n faz mal, vai
function addLetterSpacingProperty(propertiesMap: Map<string, any>, letterSpacing: BaseNonResizableTextMixin["letterSpacing"]) {
  if(letterSpacing !== figma.mixed) {
    let letterSpacingValue;

    switch(letterSpacing.unit) {
      case "PIXELS":
        letterSpacingValue = `${letterSpacing.value}px`
      case "PERCENT":
        letterSpacingValue = `${letterSpacing.value}%`
    }

    propertiesMap.set("letterSpacing", letterSpacingValue)
  } else {
    propertiesMap.set("letterSpacing", "Mixed")
  }
}

function addCornerRadiusProperty(propertiesMap: Map<string, any>, cornerRadius: CornerMixin["cornerRadius"]) {
  if(cornerRadius !== figma.mixed) {
    propertiesMap.set("cornerRadius", cornerRadius)
  } else {
    propertiesMap.set("cornerRadius", "Mixed")
  }
}

// PaintProperty
function addStrokesProperty(propertiesMap: Map<string, any>, strokes: MinimalStrokesMixin["strokes"]) {
  if(strokes.length == 1) {
    // só entra se tiver apenas um fill, então posso pegar só o primeiro valor e vai dar certo
    let strokeValue;
    let opacity = strokes[0].opacity
    let fill = strokes[0]

    switch(fill.type) {
      case "SOLID":
        let rgbColor = (fill as SolidPaint).color
        let rgb255Color = RGBtoRGB255(rgbColor.r, rgbColor.g, rgbColor.b)
        strokeValue = `rgb(${rgb255Color.r}, ${rgb255Color.g}, ${rgb255Color.b})`
        break
      case "GRADIENT_LINEAR":
        strokeValue = "Linear Gradient"
        break
      case "GRADIENT_RADIAL":
        strokeValue = "Radial Gradient"
        break
      case "GRADIENT_ANGULAR":
        strokeValue = "Angular Gradient"
        break
      case "GRADIENT_DIAMOND":
        strokeValue = "Diamond Gradient"
        break
      case "IMAGE":
        strokeValue = "Image"
        break
      case "VIDEO":
        strokeValue = "Video"
        break
      case "PATTERN":
        strokeValue = "Pattern"
    }

    if(opacity && opacity < 1)
      strokeValue += " - " + (opacity *= 100).toFixed(0)
    
    propertiesMap.set("strokes", strokeValue)
  } else {
    propertiesMap.set("strokes", "Multiple")
  }
}

function addEffectsProperty(propertiesMap: Map<string, any>, effects: BlendMixin["effects"]) {
  if(effects.length == 1) {
    let effect = effects[0]
    let effectValue;

    switch(effect.type) {
      case "DROP_SHADOW":
        effectValue = "Shadow"
      case "INNER_SHADOW":
        effectValue = "Inner shadow"
      case "LAYER_BLUR":
        effectValue = "Layer blur"
      case "BACKGROUND_BLUR":
        effectValue = "Background blur"
      case "NOISE":
        effectValue = "Noise blur"
      case "TEXTURE":
        effectValue = "Texture"
      case "GLASS":
        effectValue = "Glass"
    }

    propertiesMap.set("effects", effectValue)
  } else {
    propertiesMap.set("effects", "Multiple")
  } 
}

function addFontNameProperty(propertiesMap: Map<string, any>, fontName: BaseNonResizableTextMixin["fontName"]) {
  if(fontName !== figma.mixed) {
    propertiesMap.set("fontFamily", fontName.family)
    propertiesMap.set("fontStyle", fontName.style)
  } else {
    propertiesMap.set("fontFamily", "Mixed")
    propertiesMap.set("fontStyle", "Mixed")
  }
}

function addMainComponentProperty(propertiesMap: Map<string, any>, mainComponent: ComponentNode | null) {
    if(mainComponent) {
      propertiesMap.set("mainComponent", mainComponent.name)
    }
}

// ?
// function addAlignItemsProperty() {
  
// }

// ?
// function addPaddingProperty() {

// }

// WIP
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
    if(prop == "fontName") {
      if(node.fontName !== figma.mixed) {
        textProperties.set("fontFamily", node.fontName.family)
        textProperties.set("fontStyle", node.fontName.style)
      } else {
        textProperties.set("fontFamily", node.fontName.description)
        textProperties.set("fontStyle", node.fontName.description)
      }
    }

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
