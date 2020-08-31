meta:
  id: hedgelib_header
  endian: be
seq:
    - id: header
      type: 
          switch-on: is_forces
          cases:
              true : mirage_header
              _: gens_header      
instances:   
    magic:
      type: u4
      pos: 4
    is_forces:
      value: magic == 0x133054A 
types:
  mirage_header:
    seq:
      - id: root
        type: mirage_node
  mirage_node:
    seq:
      - id: is_rootnode
        type: b1
      - id: is_last_child_node
        type: b1 
      - id: is_leaf
        type: b1 
      - id: datasize
        type: b29
      - id: value
        type: u4
      - id: footer_offset
        type: u4
        if: is_rootnode
      - id: footer_count
        type: u4
        if:  is_rootnode        
      - id: name
        type: str
        size: 8
        encoding: ASCII
        if: not is_rootnode
      - id: sub_node
        type: mirage_node
        if: not is_leaf
        repeat: until
        repeat-until: _.is_last_child_node
  
  gens_header:
    seq:
      - id: file_size
        type: u4
      - id: root_node_type
        type: u4
      - id: footer_offset
        type: u4
      - id: root_node_size
        type: u4
      - id: file_end_offset
        type: u4
      - id: root_node_offset
        type: u4
    instances:
      footer:
        pos: footer_offset + root_node_size
        type: gens_footer

  gens_footer:
    seq:
      - id: offset_count
        type: u4
      - id: offsets
        type: u4
        repeat: expr
        repeat-expr: offset_count
        
 
