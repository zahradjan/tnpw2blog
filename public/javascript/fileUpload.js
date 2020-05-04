import * as FilePond from 'filepond';



// Import the plugin code
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';

import 'filepond/dist/filepond.min.css';


FilePond.registerPlugin(FilePondPluginImagePreview,FilePondPluginImageResize);

const inputElement = document.querySelector('input[type="file"]');
const pond = FilePond.create( inputElement );