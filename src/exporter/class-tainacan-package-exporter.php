<?php

/**
 * @author: Vinicius Nunes.
 * Term Exporter
 *
 * Class to export package tainacan
 * 
 * the planning:
 * 
 * Export:
 *	structures
 *		repositories
 *			taxonomies (terms)
 *			metadada
 *			filters
 *		collection
 *			metadada
 *			filters
 *			self collection
 *			item
 *
 */
 

namespace Tainacan\Exporter;
use Tainacan;
use Tainacan\Entities;
use Tainacan\Repositories;

class Package_Exporter extends Exporter {

	protected $steps = [
		[
			'name' => 'Check structure',
			'progress_label' => 'Exporting checking structure',
			'callback' => 'checkStructure'
		],
		[
			'name' => 'Taxonomies',
			'progress_label' => 'Exporting taxonomies',
			'callback' => 'exportingTaxonomies'
		],
		[
			'name' => 'Terms',
			'progress_label' => 'Exporting terms',
			'callback' => 'exportingTerms'
		],
		[
			'name' => 'compress package',
			'progress_label' => 'Exporting compressing package',
			'callback' => 'compressPackage'
		]
		
	];

	public function __construct($attributes = array()){
		parent::__construct($attributes);

		$upload_dir = trailingslashit( wp_upload_dir()['basedir'] );
		$exporter_folder = 'tainacan/exporter';
		$package_folder = "/package";
		$this->final_folder = $upload_dir . $exporter_folder . $package_folder;

		$this->set_default_options([]);
	}

	/**
	 * When exporter is finished, gets the final output
	 */
	public function get_output() {
		return "link to Package;";
	}

	public function options_form() {
		ob_start();
		?>
			<div>
			</div>
		<?php
		return ob_get_clean();
}

	public function process_item($index, $collection_definition) {
			return true;
	}

	public function checkStructure() {
		if (!is_dir($this->final_folder)) {
			if (!mkdir($this->final_folder, 0777, true)) {
				$this->add_error_log( 'Erro on create the folder: ' . $this->final_folder);
				return false;
			}
		}
	}

	public function compressPackage() {

	}

	public function exportingTaxonomies() {
		$taxonomyRepository = Repositories\Taxonomies::get_instance();
		$taxonomies = $taxonomyRepository->fetch();
		if($taxonomies->have_posts()) {
			$fileTaxonomies = "package/tnc_taxonomies";
			$listTaxonomies = [];
			while ($taxonomies->have_posts()) {
				$taxonomies->the_post();
				$taxonomy = new Entities\Taxonomy($taxonomies->post);
				$listTaxonomies[] = $taxonomy->_toJson();
			}
			$this->append_to_file($fileTaxonomies, '[' . \implode(",", $listTaxonomies) . ']', false);
			wp_reset_postdata();
		}
		return true;
	}

	public function exportingTerms() {

		$term_exporte = new Term_Exporter();
		$term_repo = Repositories\Terms::get_instance();
		$taxonomies = Repositories\Taxonomies::get_instance()->fetch();

		if($taxonomies->have_posts()) {
			while ($taxonomies->have_posts()) {
				$taxonomies->the_post();
				$taxonomy = new Entities\Taxonomy($taxonomies->post);
				$file_name = 'package/' . $taxonomy->get_id() . '_' . $taxonomy->get_name() . '_terms.csv';
				$term_exporte->get_terms_recursively( $term_repo, $taxonomy, 0, 0, $file_name, false );
			}
			wp_reset_postdata();
		}
		return true;
	}
}