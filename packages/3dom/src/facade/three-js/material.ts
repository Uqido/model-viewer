/* @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {MeshStandardMaterial} from 'three';

import {Material as GLTFMaterial} from '../../gltf-2.0.js';
import {SerializedMaterial} from '../../protocol.js';
import {Material as MaterialInterface} from '../api.js';

import {ModelGraft} from './model-graft.js';
import {PBRMetallicRoughness} from './pbr-metallic-roughness.js';
import {ThreeDOMElement} from './three-dom-element.js';


const $pbrMetallicRoughness = Symbol('pbrMetallicRoughness');

/**
 * Material facade implementation for Three.js materials
 */
export class Material extends ThreeDOMElement implements MaterialInterface {
  private[$pbrMetallicRoughness]: PBRMetallicRoughness|null = null;

  constructor(
      graft: ModelGraft, material: GLTFMaterial,
      correlatedMaterials: Set<MeshStandardMaterial>) {
    super(graft, material, correlatedMaterials);

    const {pbrMetallicRoughness} = material;

    if (pbrMetallicRoughness != null) {
      this[$pbrMetallicRoughness] = new PBRMetallicRoughness(
          graft, pbrMetallicRoughness, correlatedMaterials);
    }
  }

  get pbrMetallicRoughness() {
    return this[$pbrMetallicRoughness];
  }

  toJSON(): SerializedMaterial {
    const serialized: Partial<SerializedMaterial> = super.toJSON();
    const {pbrMetallicRoughness} = this;
    if (pbrMetallicRoughness != null) {
      serialized.pbrMetallicRoughness = pbrMetallicRoughness.toJSON();
    }
    return serialized as SerializedMaterial;
  }
}
