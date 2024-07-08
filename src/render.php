<?php
/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

// Generate unique id for aria-controls.
$unique_id = wp_unique_id( 'p-' );
$canvas_id = wp_unique_id('boid-canvas-');
?>

<div
	<?php echo get_block_wrapper_attributes(); ?>
	data-wp-interactive="create-block"
	<?php echo wp_interactivity_data_wp_context( array( 
		'boidTrails' => $attributes['boidTrails'] ,
		'boidCount' => $attributes['boidCount'],
		'boidLookRange' => $attributes['boidLookRange'],
		'viewHeight' => $attributes['viewHeight'],
		'viewWidth' => $attributes['viewWidth'],
		'canvasId' => $canvas_id
		) ); ?>
	data-wp-watch=""
	data-wp-init="actions.startSim"
>
	<div class="simulation-controls">
		<input
			data-wp-on--change="actions.updateLookRange"
			type="range"
			min="<?php echo $attributes['lookRange']['min']?>"
			max="<?php echo $attributes['lookRange']['max']?>"
			step="1"
		/>
		<input
			data-wp-on--change="actions.updateCenteringFactor"
			type="range"
			min="<?php echo $attributes['centeringRange']['min']?>"
			max="<?php echo $attributes['centeringRange']['max']?>"
			step="0.001"
		/>
		<input
			data-wp-on--change="actions.updateAvoidFactor"
			type="range"
			min="<?php echo $attributes['avoidRange']['min']?>"
			max="<?php echo $attributes['avoidRange']['max']?>"
			step="0.05"
		/>
		<input
			data-wp-on--change="actions.updateCoherenceFactor"
			type="range"
			min="<?php echo $attributes['coherenceRange']['min']?>"
			max="<?php echo $attributes['coherenceRange']['max']?>"
			step="0.05"
		/>
		<button
			data-wp-on--click="actions.toggleTrails"
			aria-controls="<?php echo esc_attr( $unique_id ); ?>"
		>
			<?php esc_html_e( 'Toggle Trails', 'dyn-boid' ); ?>
		</button>
	
	</div>

	<canvas 
		id="<?php echo $canvas_id ?>" 
		height="<?php echo $attributes['viewHeight'] ?>"
		width="<?php echo $attributes['viewWidth'] ?>"
	></canvas>
</div>
