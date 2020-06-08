<?php

namespace Tainacan\Metadata_Types;

defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/**
 * Class TainacanMetadatumType
 */
class Url extends Metadata_Type {
	use \Tainacan\Traits\Formatter_Text;

    function __construct(){
        // call metadatum type constructor
        parent::__construct();
        parent::set_primitive_type('string');
		parent::set_component('tainacan-url');
		$this->set_name( __('URL', 'tainacan') );
		$this->set_description( __('A URL link, if possible with an embed of the content.', 'tainacan') );
		$this->set_preview_template('
			<div>
				<div class="control is-clearfix">
					<input type="url" placeholder="' . __('Type here...') . '" class="input"> 
				</div>
			</div>
		');
    }
	
	/**
	 * Get the value as a HTML string with links
	 * @return string
	 */
	public function get_value_as_html(\Tainacan\Entities\Item_Metadata_Entity $item_metadata) {
		global $wp_embed;
		$value = $item_metadata->get_value();
		$return = '';

		if ( is_array($value) && $item_metadata->is_multiple() ) {
			$total = sizeof($value);
			$count = 0;
			$prefix = $item_metadata->get_multivalue_prefix();
			$suffix = $item_metadata->get_multivalue_suffix();
			$separator = $item_metadata->get_multivalue_separator();
			foreach ( $value as $el ) {
				$return .= $prefix;
				
				$embed = $wp_embed->autoembed($el);
				
				if ( $embed == $el ) {
					$return .= $this->make_clickable_links($el);
				} else {
					$return .= $embed;
				}

				$return .= $suffix;

				$count ++;
				if ($count < $total)
					$return .= $separator;
			}
		} else {

			$embed = $wp_embed->autoembed($value);
			
			if ( $embed == $value ) {
				$return = $this->make_clickable_links($value);
			} else {
				$return = $embed;
			}
		}
		return $return;
	}
}