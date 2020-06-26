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

import {ConstructedWithArguments, Constructor, PBRMetallicRoughness as PBRMetallicRoughnessInterface, RGBA, TextureInfo, ThreeDOMElement} from '../api.js';
import {SerializedPBRMetallicRoughness} from '../protocol.js';

import {ModelKernel} from './model-kernel.js';

export type PBRMetallicRoughnessConstructor =
    Constructor<PBRMetallicRoughnessInterface>&
    ConstructedWithArguments<[ModelKernel, SerializedPBRMetallicRoughness]>;

/**
 * A constructor factory for a PBRMetallicRoughness class. The
 * PBRMetallicRoughness is defined based on a provided implementation for all
 * specified 3DOM scene graph element types.
 *
 * The sole reason for using this factory pattern is to enable sound type
 * checking while also providing for the ability to stringify the factory so
 * that it can be part of a runtime-generated Worker script.
 *
 * @see ../api.ts
 */
export function definePBRMetallicRoughness(
    ThreeDOMElement: Constructor<ThreeDOMElement>):
    PBRMetallicRoughnessConstructor {
  const $kernel = Symbol('kernel');
  const $baseColorFactor = Symbol('baseColorFactor');
  const $visible = Symbol('visible');
  const $baseColorTexture = Symbol('baseColorTexture');
  const $metallicRoughnessTexture = Symbol('metallicRoughnessTexture');
  const $normalScale = Symbol('normalScale');
  const $doubleSide = Symbol('doubleSide');

  /**
   * PBRMetallicRoughness exposes the PBR properties for a given Material.
   */
  class PBRMetallicRoughness extends ThreeDOMElement implements
      PBRMetallicRoughnessInterface {
    protected[$kernel]: ModelKernel;
    protected[$baseColorFactor]: Readonly<RGBA>;
    protected[$visible]: boolean;
    protected[$baseColorTexture]: TextureInfo|null = null;
    protected[$metallicRoughnessTexture]: TextureInfo|null = null;
    protected[$normalScale]: number;
    protected[$doubleSide]: boolean;

    constructor(
        kernel: ModelKernel, serialized: SerializedPBRMetallicRoughness) {
      super(kernel, serialized);
      this[$kernel] = kernel;
      this[$visible] = serialized.visible;
      this[$normalScale] = serialized.normalScale;
      this[$doubleSide] = serialized.doubleSide;
      this[$baseColorFactor] =
          Object.freeze(serialized.baseColorFactor) as RGBA;

      const {baseColorTexture, metallicRoughnessTexture} = serialized;

      if (baseColorTexture != null) {
        this[$baseColorTexture] =
            kernel.deserialize('texture-info', baseColorTexture);
      }

      if (metallicRoughnessTexture != null) {
        this[$metallicRoughnessTexture] =
            kernel.deserialize('texture-info', metallicRoughnessTexture);
      }
    }

    get visible() {
      return this[$visible];
    }

    async setVisible(value: boolean) {
      console.log('setVisible');
      await this[$kernel].mutate(this, 'visible', value);
      this[$visible] = value;
    }

    get doubleSide() {
      return this[$doubleSide];
    }

    async setDoubleSide(value: boolean) {
      console.log('setDoubleSide');
      await this[$kernel].mutate(this, 'doubleSide', value);
      this[$doubleSide] = value;
    }

    get normalScale() {
      return this[$normalScale];
    }

    async setNormalScale(value: number) {
      console.log('setNormalScale');
      await this[$kernel].mutate(this, 'normalScale', value);
      this[$normalScale] = value;
    }


    /**
     * The base color factor of the material in RGBA format.
     */
    get baseColorFactor() {
      return this[$baseColorFactor];
    }

    get baseColorTexture() {
      return this[$baseColorTexture];
    }

    get metallicRoughnessTexture() {
      return this[$metallicRoughnessTexture];
    }

    /**
     * Set the base color factor of the material.
     * Requires the material-properties capability.
     *
     * @see ../api.ts
     */
    async setBaseColorFactor(color: RGBA) {
      await this[$kernel].mutate(this, 'baseColorFactor', color);
      this[$baseColorFactor] = Object.freeze(color) as RGBA;
    }
  }

  return PBRMetallicRoughness;
}
