const {
    Observable,
    Subject,
    concat,
    defer,
    timer,
    EMPTY,
} = rxjs;



/** Gallery manager for Gigatron programs */
export class Gallery {
    /** Create a new Gallery
     * @param {Loader} loader - The loader to use for program loading
     * @param {Audio} audio - The audio system to configure
     */
    constructor(loader, audio, gamepad, spi) {
        this.loader = loader;
        this.audio = audio;
        this.galleryData = null;
        this.loaded = false;
    }

    /** Load gallery data from JSON file */
    async loadGallery() {
        try {
            const response = await fetch('gallery.json');
            if (!response.ok) {
                throw new Error('Could not load gallery.json');
            }
            this.galleryData = await response.json();
            this.loaded = true;
        } catch (error) {
            console.error('Error loading gallery:', error);
            // Create empty gallery if JSON fails to load
            this.galleryData = { sections: [] };
            this.loaded = true;
        }
    }

    /** Get all sections in the gallery */
    getSections() {
        return this.galleryData.sections || [];
    }

    /** Resolve a path - absolute paths (starting with /) are relative to emulator root,
     * relative paths are relative to program directory */
    resolvePath(program, key, defaultValue) {
        let path = program[key];
        if (!path)
            path = defaultValue;
        if (!path)
            return path;
        if (path.startsWith('/'))
            return path.substring(1);
        return `programs/${program.directory}/${path}`;
    }

    /** Load a program from gallery data.
        Return observable. */
    loadProgram(program) {
        // Set audio bits if specified (default is 4)
        const audiobits = program.audiobits || 4;
        this.audio.audiobits = audiobits;
        // Resolve rom and gt1
        const romPath = this.resolvePath(program, 'rom', '/gigatron.rom');
        const gt1Path = this.resolvePath(program, 'gt1', null);
        // Concat
        return concat(
            this.loader.loadRomUrl(romPath),
            timer(1000),
            (gt1Path) ? this.loader.loadUrl(gt1Path) : EMPTY);
    }

    /** Render the gallery into a container element
     * @param {jQuery} $container - The jQuery container to render into
     * @returns {Promise<void>} */
    async renderGallery(container) {
        // Wait for gallery to be loaded
        while (!this.loaded) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        const sections = this.getSections();
        container.empty();

        if (sections.length === 0) {
            container.append('<p>No programs available in gallery.</p>');
            return;
        }

        sections.forEach(section => {
            container.append(`<h3>${section.name}</h3>`);
            const row = $(`<div class="gallery-section"></div>`);
            let carousel = $(`<div class="program-carousel"></div>`);

            section.programs.forEach(program => {
                const item = $(`<div class="program-item"></div>`);
                item.data('program', program)

                // Create screenshot element
                const screenshot = $(`<img class="program-screenshot" src="" alt="Screenshot"` +
                                      `onerror="this.onerror=null; this.src='programs/thumbnail.png'">`);
                let screenshotPath = "programs/thumbnail.png";
                if (program.screenshot)
                    screenshotPath = `programs/${program.directory}/${program.screenshot}`;
                screenshot.attr('src', screenshotPath);
                item.append(screenshot);

                // Create name element
                const name = $(`<div class="program-name">${program.name || 'Unnamed Program'}</div>`);
                item.append(name);

                // Create description element if present
                let $description = null;
                if (program.description) {
                    const description = $(`<div class="program-description">${program.description}</div>`);
                    item.append(description);
                }
                carousel.append(item);
            });

            row.append(carousel);
            container.append(row);
        });
    }
}
