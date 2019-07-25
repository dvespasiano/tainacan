<?php

namespace Tainacan\Importer;
use Tainacan;
use Tainacan\Entities;
use Tainacan\Repositories;

class Package_Importer extends Importer {
	private $new_ids;
	public function __construct($attributes = array()) {
		parent::__construct($attributes);

		$this->new_ids = ['taxonomy'=>[], 'taxonomy_reverse' => []];

		$this->package_folder = "/var/www/html/wp-content/uploads/tainacan/exporter/package/";

	}

	protected $steps = [
		[
			'name' => 'Create Taxonomies',
			'progress_label' => 'Creating taxonomies',
			'callback' => 'create_taxonomies'
		],
		[
			'name' => 'Create Terms',
			'progress_label' => 'Creating terms',
			'callback' => 'create_terms'
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
				$tax_old_id = $tax->id;
				$taxonomy = $taxonomy_repository->insert($taxonomy);
				$this->new_ids['taxonomy'][$tax_old_id] = $taxonomy->get_id();
				$this->new_ids['taxonomy_reverse'][$taxonomy->get_id()] = $tax_old_id;
			}
		}
		$this->add_transient("new_ids", $this->new_ids);
	}

	public function create_terms() {
		$this->new_ids = $this->get_transient('new_ids');
		if ($this->new_ids == null) return true;
		
		$taxonomies_stack = $this->get_transient('taxonomies');
		if ($taxonomies_stack === null) {
			$taxonomies_stack = $this->new_ids['taxonomy_reverse'];
		}

		if( !empty($taxonomies_stack) ) {
			$taxonomy_old_id = end($taxonomies_stack);
			$taxonomy_id = key($taxonomies_stack);
			$taxonomy = Repositories\Taxonomies::get_instance()->fetch($taxonomy_id);
			if (! $taxonomy instanceof Tainacan\Entities\Taxonomy) {
				$this->add_error_log("error on retrieving taxonomy");
				return false;
			}
			$file_name = $this->package_folder . $taxonomy_old_id . '_' . $taxonomy->get_name() . '_terms.csv';
			$in_step_count = $this->get_transient('in_step_count') != null ? $this->get_transient('in_step_count') : 0 ;

			$term_importer = $this->get_transient('term_importer') != null ? $this->get_transient('term_importer') : new Term_Importer(); 
			$term_importer->add_transient('new_taxonomy', $taxonomy->get_db_identifier() );
			$term_importer->set_tmp_file($file_name);
			$term_importer->set_in_step_count($in_step_count);

			$return_import = $term_importer->create_terms();
			if (!is_bool($return_import)) {
				$this->add_transient('taxonomies', 		$taxonomies_stack);
				$this->add_transient('in_step_count', $return_import);
				$this->add_transient('term_importer', $term_importer);
				return $return_import;
			} elseif ($return_import == true) {
				array_pop($taxonomies_stack);
				$this->add_transient('taxonomies', 		$taxonomies_stack );
				$this->add_transient('in_step_count', null);
				$this->add_transient('term_importer', null);
				$this->add_log( \implode( "\n", $term_importer->get_log() ) );
				return 0;
			} elseif ($return_import == false) {
				$this->add_error_log("Error on create terms: " . \implode("-", $term_importer->get_error_log()) );
				return false;
			}
		} else {
			$this->add_log('finished import terms.');
			return true;
		}
	}
}
