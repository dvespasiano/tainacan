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
			'name' => 'Taxonomies',
			'progress_label' => 'Exporting taxonomies/terms',
			'callback' => 'exporting_taxonomies'
		]
	];

	public function __construct($attributes = array()){
		parent::__construct($attributes);
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

	/**
	 * 
	 */
	public function exporting_taxonomies() {

		$taxonomyRepository = Repositories\Taxonomies::get_instance();
		$termRepository = Repositories\Terms::get_instance();
		$taxonomies = $taxonomyRepository->fetch();
		if($taxonomies->have_posts()) {
			while ($taxonomies->have_posts()) {
				$taxonomies->the_post();
				$taxonomy = new Entities\Taxonomy($taxonomies->post);
				$this->getTermsRecursively( $termRepository, $taxonomy );
			}
			wp_reset_postdata();
		}
		return true;
	}

	/**
	 * @param $termRepository Repositories\Terms the terms repository
	 * @param $taxonomy Entities\Taxonomy the taxonomy to fetch the terms
	 * @param $parent int the id of term father
	 * @param $level int the level to create the csv line
	 *
	 * @return string
	 */
	public function getTermsRecursively( $termRepository, $taxonomy, $parent = 0, $level = 0 ) {
		$terms = $termRepository->fetch([ 'parent' => $parent, 'hide_empty' => false ], $taxonomy->get_id());
		$fileTerm = $taxonomy->get_id() . "_terms";
		if( $terms && sizeof($terms) > 0 ) {
			$line = [];
			foreach ( $terms as $term ) {
				$line[] = $term->get_name();
				$line[] = $term->get_description();
				for ($i =0; $i < $level; $i++){
						array_unshift($line, "" );
				}
				
				$line_string = $this->str_putcsv($line);
				$this->append_to_file($fileTerm, $line_string."\n");
				$this->getTermsRecursively($termRepository, $taxonomy, $term->get_id(), $level + 1);
				$line = array();
			}
		}
	}

	function str_putcsv($item, $delimiter = ',', $enclosure = '"') {
		$fp = fopen('php://temp', 'r+');
		fputcsv($fp, $item, $delimiter, $enclosure);
		rewind($fp);
		$fstats = fstat($fp);
		$data = fread($fp, $fstats['size']);
		fclose($fp);
		return rtrim($data, "\n");
	}

}