<?php

namespace Tainacan\Importer;
use Tainacan;
use Tainacan\Entities;
use Tainacan\Repositories;

class Package_Importer extends Importer {
	private $new_ids;
	public function __construct($attributes = array()) {
		parent::__construct($attributes);

		$this->new_ids = [];

		$this->package_folder = "/var/www/html/wp-content/uploads/tainacan/exporter/package/";

	}

	protected $steps = [
		[
			'name' => 'Create Taxonomies',
			'progress_label' => 'Creating taxonomies',
			'callback' => 'create_taxonomies'
		]
	];

	public function set_option($key,$value) {
		$this->default_options[$key] = $value;
	}

	public function process_item( $index, $collection_definition ) {
			return false;
	}

	public function options_form() {
		ob_start();
		?>
			<div> </div>
		<?php
		return ob_get_clean();
	}

	public function create_taxonomies() {
		$file_taxonomies = "tnc_taxonomies";

		$taxonomy_repository = Repositories\Taxonomies::get_instance();
		$str_json_taxonomies = file_get_contents($this->package_folder . $file_taxonomies);
		$taxonomiesList = \json_decode($str_json_taxonomies);

		foreach ($taxonomiesList as $tax) {
			$taxonomy = new Entities\Taxonomy();
			foreach ($tax as $key => $value){
				$set_ = 'set_' . $key;
				if (method_exists( $taxonomy, $set_ ) ) {
					$taxonomy->$set_($value);
				}
			}
			if ($taxonomy->validate()) {
				$t = $taxonomy_repository->insert($taxonomy);
				$this->new_ids['taxonomy'][$taxonomy->id] = $taxonomy->get_id();
			}
		}
	}

	public function create_terms() {
		$file_taxonomies = "tnc_terms";

		$term_repository = Repositories\Terms::get_instance();
		$str_json_terms = file_get_contents($this->package_folder . $file_taxonomies);
		$terms_list = \json_decode($str_json_terms);

		// foreach ($terms_list as $term) {
		// 	$new_term = new Entities\Term();
		// 	foreach ($term as $key => $value) {
		// 		$set_ = 'set_' . $key;
		// 		if (method_exists( $new_term, $set_ ) ) {
		// 			$new_term->$set_($value);
		// 		}
		// 	}
		// 	if ($new_term->validate()) {
				
		// 		$new_term->set_taxonomy($this->new_ids['taxonomy'][$new_term->get_taxonomy()]);

		// 		$t = $term_repository->insert($new_term);
		// 		$this->new_ids['term'][$term->id] = $new_term->get_id();
		// 	}
		// }

	}
}
