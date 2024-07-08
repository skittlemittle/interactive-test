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
        <PanelBody title={__("Simulation Settings", "boids")}>
          <RangeControl
            label={__("look ahead range", "boids")}
            value={attributes.boidLookRange}
            onChange={(val) => setAttributes({ boidLookRange: Number(val) })}
            min={attributes.lookRange.min}
            max={attributes.lookRange.max}
          />

          <RangeControl
            label={__("number of boids", "boids")}
            value={attributes.boidCount}
            onChange={(val) => setAttributes({ boidCount: Number(val) })}
            min={attributes.countRange.min}
            max={attributes.countRange.max}
          />

          <SelectControl
            label={__("flight trails", "boids")}
            value={attributes.boidTrails}
            onChange={(val) => setAttributes({ boidTrails: val })}
            options={[
              { label: "Off", value: false },
              { label: "On", value: true },
            ]}
          />
        </PanelBody>
      </InspectorControls>

      <p {...blockProps}>
        {__("Dyn Boid – hello from the editor!", "dyn-boid")}
      </p>
    </>
  );
}
