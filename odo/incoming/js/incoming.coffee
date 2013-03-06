$ () ->
	musicalInstruments = [
		'Bagpipes'
		'Banjo'
		'Bass drum'
		'Bassoon'
		'Bell'
		'Bongo'
		'Castanets'
		'Cello'
		'Clarinet'
		'Clavichord'
		'Conga drum'
		'Contrabassoon'
		'Cornet'
		'Cymbals'
		'Double bass'
		'Dulcian'
		'Dynamophone'
		'Flute'
		'Flutophone'
		'Glockenspiel'
		'Gongs'
		'Guitar'
		'Harmonica'
		'Harp'
		'Harpsichord'
		'Lute'
		'Mandolin'
		'Maracas'
		'Metallophone'
		'Musical box'
		'Oboe'
		'Ondes-Martenot'
		'Piano'
		'Recorder'
		'Saxophone'
		'Shawm'
		'Snare drum'
		'Steel drum'
		'Tambourine'
		'Theremin'
		'Triangle'
		'Trombone'
		'Trumpet'
		'Tuba'
		'Ukulele'
		'Viola'
		'Violin'
		'Xylophone'
		'Zither'
	]

	medicalEquipment = [
		'Airway adjuncts (nasal cannulae, non-rebreather masks, guerdel airways)'
		'Automated Sphygmomanometers'
		'Syringe Pumps (B Braun)'
		'Blood glucose monitor apparatus'
		'Cardiac monitors/defibrillators: Zoll 3 lead and Zoll 12 lead with IBP capabilities'
		'Propaq Monitors'
		'Chest drainage equipment with Heimlich valves'
		'Current ALS medications'
		'Difficult airway intubation apparatus (Airtraq, King’s Larynx tubes, I-Gel)'
		'Ventilators (Drager Oxylog 1000, Drager Oxylog2000, Drager Oxylog3000)'
		'Endotracheal intubation equipment'
		'Full body splint vacuum mattresses'
		'Head blocks'
		'Intravenous fluids (crystalloids, Colloids)'
		'I-Stat Handheld Laboratory equipment'
		'Kendrick Extrication Devices'
		'Automated suction units (LSU)'
		'Neonatal transport incubator'
		'Non Invasive Ventilation masks'
		'Portable pulse oxymeters (Nonin)'
		'Pediatric and Neonatal resuscitation equipment'
		'Pediatric Broslow tape and bag'
		'Portable stream light torches'
		'RSI drugs'
		'Scoop stretchers'
		'Snake anti-venom'
		'Traction splints and stiff neck collars'
		'WHO approved cool boxes for maintenance of cold chain'
	]

	input = $ '#itemsearch'
	input.typeselect {
		sources: {
			'Musical Instruments': musicalInstruments
			'Medical Equipment': medicalEquipment
		}
	}
	input.focus()

	$(document).keyup (e) ->
        window.close() if e.keyCode is 27 and input.is ':focus'

	$('#incoming .close').click (e) ->
		e.preventDefault()
		window.close()

	$('.editable').editable {
		unsavedclass: null
	}