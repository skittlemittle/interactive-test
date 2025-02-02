/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
  useBlockProps,
  InspectorControls,
  PanelColorSettings,
} from "@wordpress/block-editor";
import { PanelBody, RangeControl, SelectControl } from "@wordpress/components";
/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Properties passed to the function.
 * @param {Object}   props.attributes    Available block attributes.
 * @param {Function} props.setAttributes Function that updates individual attributes.
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
  const blockProps = useBlockProps();

  const colorSettings = [
    {
      label: __("boid color", "dyn-boid"),
      value: attributes.boidColor,
      onChange: (v) => setAttributes({ boidColor: v }),
    },
    {
      label: __("trail color", "dyn-boid"),
      value: attributes.trailColor,
      onChange: (v) => setAttributes({ trailColor: v }),
    },
  ];

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Canvas Settings", "boids")}>
          <RangeControl
            label="width"
            value={attributes.viewWidth}
            onChange={(val) => setAttributes({ viewWidth: Number(val) })}
            min={150}
            max={1000}
          />
          <RangeControl
            label="height"
            value={attributes.viewHeight}
            onChange={(val) => setAttributes({ viewHeight: Number(val) })}
            min={150}
            max={1000}
          />
        </PanelBody>
        <PanelBody title={__("Simulation Settings", "dyn-boid")}>
          <RangeControl
            label={__("look ahead range", "dyn-boid")}
            value={attributes.boidLookRange}
            onChange={(val) => setAttributes({ boidLookRange: Number(val) })}
            min={attributes.lookRange.min}
            max={attributes.lookRange.max}
          />

          <RangeControl
            label={__("edge avoidance", "dyn-boid")}
            value={attributes.edgeBounce}
            onChange={(val) => setAttributes({ edgeBounce: Number(val) })}
            min={attributes.edgeBounceRange.min}
            max={attributes.edgeBounceRange.max}
            step={0.1}
          />

          <RangeControl
            label={__("number of boids", "dyn-boid")}
            value={attributes.boidCount}
            onChange={(val) => setAttributes({ boidCount: Number(val) })}
            min={attributes.countRange.min}
            max={attributes.countRange.max}
          />

          <SelectControl
            label={__("flight trails", "dyn-boid")}
            value={attributes.boidTrails}
            onChange={(val) => setAttributes({ boidTrails: val })}
            options={[
              { label: "Off", value: false },
              { label: "On", value: true },
            ]}
          />
        </PanelBody>
        <PanelColorSettings
          title={__("Color settings", "dyn-boid")}
          initialOpen={false}
          colorSettings={colorSettings}
        ></PanelColorSettings>
      </InspectorControls>

      <canvas
        {...blockProps}
        height={attributes.viewHeight}
        width={attributes.viewWidth}
      ></canvas>
    </>
  );
}
