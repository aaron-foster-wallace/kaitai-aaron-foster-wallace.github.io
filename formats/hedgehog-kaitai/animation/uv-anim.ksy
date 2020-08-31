doc: |
      .uv-anim descriptor
      To add support to other *.XX-anims i guess is mostly 
      Modifing uv_animation and uv_animation_set block
      Others anims formats are:
        cam-anim
        lit-anim
        mat-anim
        morph-anim
        pt-anim
        uv-anim
        vis-anim     
        
meta:
  id: uv_anim
  file-extension: uv-anim
  endian: be
  imports:
    - ../common/hedgelib_header_footer
seq:
  - id: header
    type: hedgelib_header
  - id: body
    type:  uv_animation_container
instances:
  bof:
    value: header.is_forces? 0x10 : 0x18 #header.is_forces? 0x10 : _io.pos - 8
  keyframe_array:
    value: body.container.keyframes
  keyframes_len:
    value: body.container.keyframes.size 
  names_buffer_offset:
    value: body.container.strings_address 
types:
  uv_animation_container:
    seq:
      - id: container
        type: animation_container
    instances:
      uv_animations:
        pos:  container.animations_address + _root.bof       
        type: uv_animation

  uv_animation:
    seq:
      - id: string_material_name_offset
        type: u4
      - id: string_texture_unit_name_offset
        type: u4
      - id: animations_count
        type: u4
      - id: animation_table_address
        type: u4
    instances:
      material_name:
        pos:  _root.names_buffer_offset + string_material_name_offset  + _root.bof
        type: strz
        encoding: ASCII
      texset_name:
        pos:  _root.names_buffer_offset + string_texture_unit_name_offset + _root.bof
        type: strz
        encoding: ASCII        
      animation_sets:
        pos:  animation_table_address  + _root.bof
        type: uv_animation_set   
        repeat: expr
        repeat-expr: animations_count 
  
  uv_animation_set:
    seq:
      - id: string_animation_name_offset
        type: u4
      - id: fps
        type: f4
      - id: start_time
        type: f4
      - id: end_time
        type: f4
      - id: keyframe_sets_count
        type: u4
      - id: keyframe_sets
        type: keyframe_set   
        repeat: expr
        repeat-expr: keyframe_sets_count   
    instances:
      animation_name:
        pos: _root.names_buffer_offset + string_animation_name_offset  + _root.bof
        type: strz
        encoding: ASCII


  animation_container:
    seq:
      - id: animations_address
        type: u4
      - id: animations_size
        type: u4
      - id: keyframes_address
        type: u4
      - id: keyframes_size
        type: u4
      - id: strings_address
        type: u4
      - id: strings_size
        type: u4
    instances:
      libgens_animation_keyframe_bytes:
        value: 8
      keyframes_count:
        value: keyframes_size / libgens_animation_keyframe_bytes     
      animations_ptrdebug:
        pos:  animations_address + _root.bof      
        type: u4
      keyframes:
        pos:  keyframes_address + _root.bof
        type: keyframe   
        repeat: expr
        repeat-expr: keyframes_count 
      strings:
        pos:  strings_address + _root.bof
        type: str
        encoding: ASCII
        size: strings_size
  
  keyframe:
    seq:
      - id: frame
        type: f4
      - id: value
        type: f4    


  keyframe_set:
    seq:
      - id: flag
        type: u4
      - id: keyframes_count
        type: u4
      - id: keyframes_index
        type: u4
    instances:      
      keyframes:
        pos: 0
        type: elem(keyframes_index+_index)   
        repeat: expr
        repeat-expr: keyframes_count 
    types:
      elem:
        params:
          - id: index
            type: u4
        instances:          
          value:
            value: _root.keyframe_array[index]
            